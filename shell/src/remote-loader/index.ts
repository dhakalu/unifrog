const baseUrl = "http://localhost:5000" 

export const getRemoteUrl = (name: string, version: string = "latest")  => `${baseUrl}//static/remotes/${name}/${version}/remoteEntry.js`