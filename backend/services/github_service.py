import httpx
import os
from dotenv import load_dotenv

load_dotenv()

class GitHubService:
    @staticmethod
    async def get_user_repos(username: str):
        if not username:
            return []
        
        token = os.getenv("GITHUB_TOKEN")
        headers = {}
        if token and "your_github_token" not in token:
            headers["Authorization"] = f"token {token}"
            
        url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page=10"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=headers)
                if response.status_code == 200:
                    repos = response.json()
                    return [
                        {
                            "name": repo["name"],
                            "description": repo["description"],
                            "stars": repo["stargazers_count"],
                            "forks": repo["forks_count"],
                            "language": repo["language"],
                            "url": repo["html_url"],
                            "updated_at": repo["updated_at"]
                        }
                        for repo in repos
                    ]
                return []
            except Exception as e:
                print(f"Error fetching GitHub repos for {username}: {e}")
                return []
