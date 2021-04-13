import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {storage,memory} from './tool/storage'
const user=storage.readUser()
memory.user=user

ReactDOM.render(<App />,document.getElementById('root'))
