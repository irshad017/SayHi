import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AUth } from './compo/sign'
import { BlogPage } from './compo/blog'
import { OneBlog } from './compo/oneBlog'
import { Myblogs } from './compo/myblogs'
import { CreateBlog } from './compo/createBlog'
import { ChatRoom } from './compo/chatRoom'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<AUth type='signup' />} ></Route>
          <Route path='/' element={<AUth type='signin' />} ></Route>
          <Route path='/blogs' element={<BlogPage/>} ></Route>
          <Route path='/getblogs/:id' element={<OneBlog/>} ></Route>
          <Route path='/myblogs' element={<Myblogs/>} ></Route>
          <Route path='/createNew' element={<CreateBlog/>} ></Route>
          <Route path='/chatRoom' element={<ChatRoom/>} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
