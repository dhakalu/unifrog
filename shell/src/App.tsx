import "./App.css";
import { lazy, Suspense } from "react";
import {
  remotesMap,
  __federation_method_getRemote
} from  '__federation__'


remotesMap['dynamic'] = {
  url: "http://localhost:5003/assets/remoteEntry.js",
  format: 'esm',
  from: 'vite'
}
// console.log(federation)

const RemoteButton = lazy(() => {
  // __federation_method_setRemote('myRemote', {
  //   url: 'http://localhost:5000/static/remotes/react-example/latest/remoteEntry.js',
  //   format: 'esm'
  // })
  return __federation_method_getRemote('myRemote', './Button')
})

function App() {
  return (
    
    <>
      <div className="App">Let me update this and see if it did it change?! there!</div>
      <Suspense>
        <RemoteButton />
      </Suspense>
    </>
  );
}

export default App;
