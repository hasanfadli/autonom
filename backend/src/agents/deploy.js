import { exec } from "child_process";

export function deployAgent(path="./project") {
  return new Promise((res, rej) => {
    exec(`cd ${path} && railway up`, (e, out, err) => {
      if (e) return rej(err);
      res(out);
    });
  });
}
