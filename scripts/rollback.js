const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getTags() {
  try {
    const output = execSync("git tag -l 'v*' --sort=-v:refname", { encoding: "utf-8" });
    return output.trim().split("\n").filter(Boolean);
  } catch (error) {
    return [];
  }
}

function getCurrentTag() {
  try {
    const output = execSync("git describe --tags --abbrev=0", { encoding: "utf-8" });
    return output.trim();
  } catch (error) {
    return null;
  }
}

function getTagInfo(tag) {
  try {
    const date = execSync(`git log -1 --format=%ci ${tag}`, { encoding: "utf-8" }).trim();
    const message = execSync(`git log -1 --format=%s ${tag}`, { encoding: "utf-8" }).trim();
    return { date, message };
  } catch (error) {
    return { date: "未知", message: "未知" };
  }
}

async function selectTag(tags) {
  console.log("\n可用的版本标签:\n");

  const currentTag = getCurrentTag();

  tags.forEach((tag, index) => {
    const info = getTagInfo(tag);
    const isCurrent = tag === currentTag ? " (当前)" : "";
    console.log(`  ${index + 1}. ${tag}${isCurrent} - ${info.date}`);
  });

  const choice = await new Promise((resolve) => {
    rl.question("\n请选择要回滚的版本 (输入序号): ", resolve);
  });

  const index = parseInt(choice.trim()) - 1;
  if (index >= 0 && index < tags.length) {
    return tags[index];
  }

  return null;
}

function rollbackToTag(tag) {
  try {
    console.log(`\n🔄 正在回滚到 ${tag}...\n`);

    execSync(`git checkout ${tag}`, { stdio: "inherit" });

    console.log(`\n✅ 已回滚到 ${tag}`);
    console.log("\n注意: 你现在处于分离 HEAD 状态");
    console.log("如需创建新分支:");
    console.log(`  git checkout -b rollback-${tag.replace("v", "")}`);
    console.log("\n如需返回主分支:");
    console.log("  git checkout main");
  } catch (error) {
    console.log("\n❌ 回滚失败");
    console.log("请确保所有更改已提交或暂存");
  }
}

async function main() {
  console.log("⏪ 版本回滚工具\n");

  const tags = getTags();

  if (tags.length === 0) {
    console.log("❌ 没有找到任何版本标签");
    rl.close();
    return;
  }

  const currentTag = getCurrentTag();
  if (currentTag) {
    console.log(`当前版本: ${currentTag}`);
  }

  const selectedTag = await selectTag(tags);

  if (!selectedTag) {
    console.log("\n❌ 无效选择");
    rl.close();
    return;
  }

  if (selectedTag === currentTag) {
    console.log("\n⚠️ 已经在当前版本");
    rl.close();
    return;
  }

  const confirm = await new Promise((resolve) => {
    rl.question(`\n确认回滚到 ${selectedTag}? (y/n): `, resolve);
  });

  if (confirm.toLowerCase() !== "y") {
    console.log("取消回滚");
    rl.close();
    return;
  }

  rollbackToTag(selectedTag);

  rl.close();
}

main();
