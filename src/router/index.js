import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import Restoration from '@/views/Restoration.vue'
import TodoLists from '@/views/TodoLists.vue'
import TodoList from '@/views/TodoList.vue'
import UserList from '@/views/UserList.vue'
import UserProfilePreview from '@/views/UserProfilePreview.vue'
import UserProfileEdit from '@/views/UserProfileEdit.vue'
import NotFoundPage from '@/views/common/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },
  {
    path: '/restoration',
    name: 'restoration',
    component: Restoration
  },
  {
    path: '/profile',
    name: 'user-profile-edit',
    component: UserProfileEdit
  },
  {
    path: '/lists',
    name: 'todo-lists',
    component: TodoLists
  },
  {
    path: '/list',
    name: 'todo-list',
    component: TodoList
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: UserList
  },
  {
    path: '/admin/users/new',
    name: 'admin-create-user',
    component: Registration
  },
  {
    path: '/admin/users/:user_id',
    name: 'admin-user-profile-preview',
    component: UserProfilePreview
  },
  {
    path: '/admin/users/:user_id/edit',
    name: 'admin-user-profile-edit',
    component: UserProfileEdit
  },
  {
    path: '/admin/users/:user_id/lists',
    name: 'admin-user-lists',
    component: TodoLists
  },
  {
    path: '/admin/users/:user_id/lists/:list_id',
    name: 'admin-user-list',
    component: TodoList
  },

  // Common
  {
    path: '/404',
    name: 'not-found',
    component: NotFoundPage
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router