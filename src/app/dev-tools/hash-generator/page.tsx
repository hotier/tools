"use client";

import { useState, useEffect } from "react";
import { useTrackToolUsage } from "@/components/useTrackToolUsage";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { useToast } from "@/components/ToastContext";
import { Button } from "@/components/Button";

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
}

const algorithms: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];

async function calculateHash(text: string, algorithm: HashAlgorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  if (algorithm === "MD5") {
    return md5(text);
  }

  const algorithmMap: Record<string, string> = {
    "SHA-1": "SHA-1",
    "SHA-256": "SHA-256",
    "SHA-384": "SHA-384",
    "SHA-512": "SHA-512",
  };

  const hashBuffer = await crypto.subtle.digest(algorithmMap[algorithm], data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function md5(string: string): string {
  function rotateLeft(x: number, n: number) {
    return (x << n) | (x >>> (32 - n));
  }

  function addUnsigned(x: number, y: number) {
    const x8 = x & 0x80000000;
    const y8 = y & 0x80000000;
    const x4 = x & 0x40000000;
    const y4 = y & 0x40000000;
    const result = (x & 0x3fffffff) + (y & 0x3fffffff);
    if (x4 & y4) {
      return result ^ 0x80000000 ^ x8 ^ y8;
    }
    if (x4 | y4) {
      if (result & 0x40000000) {
        return result ^ 0xc0000000 ^ x8 ^ y8;
      }
      return result ^ 0x40000000 ^ x8 ^ y8;
    }
    return result ^ x8 ^ y8;
  }

  function F(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }
  function G(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }
  function H(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }
  function I(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str: string) {
    const utf8 = unescape(encodeURIComponent(str));
    const len = utf8.length;
    const words: number[] = [];
    for (let i = 0; i < len; i += 4) {
      words.push(
        (utf8.charCodeAt(i) || 0) |
          ((utf8.charCodeAt(i + 1) || 0) << 8) |
          ((utf8.charCodeAt(i + 2) || 0) << 16) |
          ((utf8.charCodeAt(i + 3) || 0) << 24)
      );
    }
    const bitLen = len * 8;
    words[len >> 2] |= 0x80 << ((len % 4) * 8);
    words[(((len + 8) >>> 6) << 4) + 14] = bitLen;
    return words;
  }

  function wordToHex(value: number) {
    let hex = "";
    for (let i = 0; i < 4; i++) {
      const byte = (value >>> (i * 8)) & 255;
      hex += ("0" + byte.toString(16)).slice(-2);
    }
    return hex;
  }

  const x = convertToWordArray(string);
  let a = 0x67452301,
    b = 0xefcdab89,
    c = 0x98badcfe,
    d = 0x10325476;

  const S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  const S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  const S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  const S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a,
      BB = b,
      CC = c,
      DD = d;

    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

export default function HashGeneratorPage() {
  useTrackToolUsage("/dev-tools/hash-generator", "Hash 生成器");
  const { showToast } = useToast();
  const [input, setInput] = useState("");
  const [results, setResults] = useState<HashResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadSample, setLoadSample] = useState(false);

  useEffect(() => {
    if (loadSample) {
      const sampleText = "Hello, World! 你好世界！";
      setInput(sampleText);
      generateWithText(sampleText);
      setLoadSample(false);
    }
  }, [loadSample]);

  const generateWithText = async (text: string) => {
    setLoading(true);
    try {
      const hashResults: HashResult[] = [];
      for (const algorithm of algorithms) {
        const hash = await calculateHash(text, algorithm);
        hashResults.push({ algorithm, hash });
      }
      setResults(hashResults);
    } catch {
      showToast("生成失败", "error");
    } finally {
      setLoading(false);
    }
  };

  const generate = async () => {
    if (!input.trim()) {
      showToast("请输入内容", "error");
      return;
    }
    await generateWithText(input);
  };

  const loadSampleData = () => {
    setLoadSample(true);
  };

  const copyAllHashes = async () => {
    if (results.length === 0) {
      showToast("没有可复制的内容", "error");
      return;
    }
    const text = results.map((r) => `${r.algorithm}: ${r.hash}`).join("\n");
    await navigator.clipboard.writeText(text);
    showToast("复制成功");
  };

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    showToast("复制成功");
  };

  return (
    <ToolPageLayout title="Hash 生成器" href="/dev-tools/hash-generator">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">输入内容</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 p-4 border rounded-lg font-mono text-sm bg-background resize-none"
          placeholder="输入要计算哈希值的文本"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button onClick={generate} variant="primary" disabled={loading}>
          {loading ? "计算中..." : "生成"}
        </Button>
        <Button
          onClick={() => {
            if (results.length > 0) {
              copyAllHashes();
            } else {
              loadSampleData();
            }
          }}
          variant={results.length > 0 ? "success" : "secondary"}
        >
          {results.length > 0 ? "复制全部" : "示例数据"}
        </Button>
        <Button
          onClick={() => {
            setInput("");
            setResults([]);
          }}
          variant="danger"
        >
          清空
        </Button>
      </div>

      {results.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium w-28">算法</th>
                <th className="px-4 py-3 text-left font-medium">哈希值</th>
                <th className="px-4 py-3 text-center font-medium w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {results.map((result) => (
                <tr key={result.algorithm} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{result.algorithm}</td>
                  <td className="px-4 py-3 font-mono text-xs break-all">{result.hash}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => copyHash(result.hash)}
                      className="text-primary hover:underline text-sm"
                    >
                      复制
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolPageLayout>
  );
}
