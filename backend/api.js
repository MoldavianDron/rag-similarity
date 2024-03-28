const JiraAPICall = async (endpoint, options) => {
    const baseURL = 'https://appfire.atlassian.net'
    const baseOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(
                `andrei.zaporojan@appfire.com:${process.env.API_TOKEN}`
            ).toString('base64')}`,
            'X-Force-Accept-Language': 'true',
            'Accept-Language': 'pl'
        }
    }

    const requestURL = `${baseURL}${endpoint}`
    const requestOptions = {
        ...baseOptions,
        ...options,
    }
    const response = await fetch(requestURL, requestOptions)
    if (!response.ok) {
        throw new Error(await response.json())
    }
    return await response.json()
}

export const issueSearch = async (searchConfig) => await JiraAPICall(
    '/rest/api/2/search',
    { method: 'POST', body: JSON.stringify({
        jql: searchConfig.jql,
        maxResults: searchConfig.maxResults,
        startAt: searchConfig.startAt,
        fields: ["summary", "description"],
    })}
)

export const getIssue = async (issueKey) => await JiraAPICall(
    `/rest/api/2/issue/${issueKey}`
)