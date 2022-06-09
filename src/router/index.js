import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import Restoration from '@/views/Restoration.vue'
import UserProfile from '@/views/UserProfile.vue'
import TodoLists from '@/views/TodoLists.vue'
import TodoList from '@/views/TodoList.vue'
import UserList from '@/views/UserList.vue'
import UserData from '@/views/UserData.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/restoration',
    name: 'Restoration',
    component: Restoration
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/lists',
    name: 'Lists',
    component: TodoLists
  },
  {
    path: '/list',
    name: 'List',
    component: TodoList
  },
  {
    path: '/admin/users',
    name: 'Users',
    component: UserList
  },
  {
    path: '/admin/users/new',
    name: 'NewUser',
    component: Registration
  },
  {
    path: '/admin/users/:user_id',
    name: 'UserData',
    component: UserData
  },
  {
    path: '/admin/users/:user_id/edit',
    name: 'EditUser',
    component: UserProfile
  },
  {
    path: '/admin/users/:user_id/lists',
    name: 'UserLists',
    component: TodoLists
  },
  {
    path: '/admin/users/:user_id/lists/:list_id',
    name: 'UserList',
    component: TodoList
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router