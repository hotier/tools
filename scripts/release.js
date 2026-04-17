const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const packageJsonPath = path.join(__dirname, "../package.json");

function execCommand(command, silent = false) {
  try {
    const result = execSync(command, { encoding: "utf-8", stdio: silent ? "pipe" : "inherit" });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function getCurrentBranch() {
  const result = execCommand("git rev-parse --abbrev-ref HEAD", true);
  if (!result.success) return "main";
  return result.output.trim();
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return packageJson.version;
}

async function promptPush() {
  const answer = await new Promise((resolve) => {
    rl.question("\n是否推送到远程仓库? (y/n): ", resolve);
  });
  return answer.toLowerCase() === "y";
}

async function main() {
  console.log("🚀 一站式版本发布流程\n");

  const currentBranch = getCurrentBranch();
  const currentVersion = getCurrentVersion();

  console.log(`当前分支: ${currentBranch}`);
  console.log(`当前版本: ${currentVersion}`);

  console.log("\n📦 Git 操作:");

  console.log("  → 添加所有更改...");
  execCommand("git add .");

  console.log(`  → 提交更改 (v${currentVersion})...`);
  const commitResult = execCommand(`git commit -m "chore: release v${currentVersion}"`);
  if (!commitResult.success) {
    console.log("  ⚠️  没有需要提交的更改");
  } else {
    console.log("  ✅ 提交成功");
  }

  console.log(`  → 创建标签 v${currentVersion}...`);
  const tagResult = execCommand(`git tag -a v${currentVersion} -m "Release v${currentVersion}"`);
  if (tagResult.success) {
    console.log("  ✅ 标签创建成功");
  } else {
    console.log("  ⚠️  标签可能已存在");
  }

  const shouldPush = await promptPush();

  if (shouldPush) {
    console.log("\n📤 推送到远程:");

    console.log("  → 推送代码...");
    const pushResult = execCommand(`git push origin ${currentBranch}`);
    if (pushResult.success) {
      console.log("  ✅ 代码推送成功");
    } else {
      console.log("  ❌ 代码推送失败");
    }

    console.log("  → 推送标签...");
    const pushTagsResult = execCommand("git push origin --tags");
    if (pushTagsResult.success) {
      console.log("  ✅ 标签推送成功");
    } else {
      console.log("  ❌ 标签推送失败");
    }

    console.log(`\n🎉 版本 v${currentVersion} 发布完成！`);
  } else {
    console.log(`\n✅ 版本 v${currentVersion} 已准备就绪`);
    console.log("\n手动推送命令:");
    console.log(`  git push origin ${currentBranch} --tags`);
  }

  rl.close();
}

main();
