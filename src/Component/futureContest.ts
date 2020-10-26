import * as vscode from "vscode";
import axios from "axios";
import { Explorer } from "../Container/explorer";

export function getFutureContests(limit: number): Thenable<Explorer[]> {
  const URL = "https://codeforces.com/api/contest.list";

  return axios.get(URL).then((res) => {
    const allContests = res.data["result"];

    const allFutureContests = allContests.filter((contest: any) => {
      return contest.phase === "BEFORE";
    });

    const limitedFutureContests = allFutureContests
      .sort(
        (contestA: any, contestB: any) => 
        contestA.startTimeSeconds - contestB.startTimeSeconds
      )
      .slice(0, limit);

    console.log(limitedFutureContests);

    const futureContestsExplorer = limitedFutureContests.map((contest: any) => {
      return new Explorer(
        contest.name,
        vscode.TreeItemCollapsibleState.Collapsed,
        contest.id
      );
    });

    return Promise.resolve(futureContestsExplorer);
  });
}
