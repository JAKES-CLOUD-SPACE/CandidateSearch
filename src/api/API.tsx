const searchGithub = async () => {
  try {
    const start = Math.floor(Math.random() * 100000000) + 1;
  //console.log('GitHub Token:', import.meta.env.VITE_GITHUB_TOKEN);

     //console.log(import.meta.env.VITE_GITHUB_TOKEN);
    const response = await fetch(
      `https://api.github.com/users?since=${start}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      console.error('GitHub API Error:', error.message);
      throw new Error(error.message);
    }
    
    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (err) {
     console.log('an error occurred6', err);
    return [];
  }
};

const searchGithubUser = async (username: string) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error('invalid API response, check the twork tab');
    }
    return data;
  } catch (err) {
    console.log('an error occurred', err);
    return {};
  }
};

export { searchGithub, searchGithubUser };
