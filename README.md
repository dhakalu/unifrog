# UNI FROG

An attempt to implement micro frontends that are:

- developed, tested and deployed independently to host server (RESTful apis that allow upload and download javascript files along with their metadata)
- Modules are ~~fully~~ somewhat library agnostic. 
- Server side rendering on the first load. Remote modules are loaded on runtime by client. (Evaluating remotes on server side could be a security threat)
- Fully type safe


## Dependencies

- Vite
- vite-module-federation
- React (The shell is developed using React)

