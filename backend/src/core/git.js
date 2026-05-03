import simpleGit from "simple-git";
const git = simpleGit();

export async function commitAll(msg="AI update") {
  await git.add(".");
  await git.commit(msg);
}
