import { Query, Databases } from "node-appwrite";

import { clientAdmin } from "@/config/appwrite-server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const minimumVotes = params.get("minimumVotes");
  const keyword = params.get("keyword");

  const repos = await new Databases(clientAdmin()).listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_REPOS_ID,
    [
      Query.select([
        "url",
        "logo",
        "description",
        "rating",
        "votes",
        "owner",
        "name",
        "badgeViews",
      ]),
      Query.orderDesc("rating"),
      Query.orderDesc("votes"),
      minimumVotes && Query.greaterThanEqual("votes", parseInt(minimumVotes)),
      Query.limit(100),
      keyword && Query.search("url", keyword),
    ]
  );

  const all = repos.documents.map((repo) => ({
    url: repo.url,
    logo: repo.logo,
    description: repo.description,
    rating: repo.rating,
    votes: repo.votes,
    owner: repo.owner,
    name: repo.name,
    badgeViews: repo.badgeViews,
  }));

  return Response.json(all);
}
