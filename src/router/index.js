import { createRouter, createWebHistory } from 'vue-router';

import Settings from '@/views/Settings.vue';
import Login from '@/views/Login.vue';
import Registration from '@/views/Registration.vue';
import Activation from '@/views/Activation.vue';
import RestorationEmail from '@/views/RestorationEmail.vue';
import Restoration from '@/views/Restoration.vue';
import DeletedUser from '@/views/DeletedUser.vue';
import GuestTodoList from '@/views/GuestTodoList.vue';
import UserTodoLists from '@/views/UserTodoLists.vue';
import UserTodoList from '@/views/UserTodoList.vue';
import UserList from '@/views/UserList.vue';
import UserProfilePreview from '@/views/UserProfilePreview.vue';
import UserProfileEdit from '@/views/UserProfileEdit.vue';
import NotFoundPage from '@/views/common/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: GuestTodoList,
    meta: {
      guestRequired: true,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      guestRequired: true,
      hideNav: true,
    },
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration,
    meta: {
      guestRequired: true,
      hideNav: true,
    },
  },
  {
    path: '/activation',
    name: 'activation',
    component: Activation,
    meta: {
      guestRequired: true,
      hideNav: true,
    },
  },
  {
    path: '/restoration-email',
    name: 'restoration-email',
    component: RestorationEmail,
    meta: {
      guestRequired: true,
      hideNav: true,
    },
  },
  {
    path: '/restoration',
    name: 'restoration',
    component: Restoration,
    meta: {
      guestRequired: true,
      hideNav: true,
    },
  },
  {
    path: '/deleted-user',
    name: 'deleted-user',
    component: DeletedUser,
    meta: {
      guestRequired: true,
      hideNav: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfileEdit,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/lists',
    name: 'lists',
    component: UserTodoLists,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/lists/:list_id',
    name: 'list',
    component: UserTodoList,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: UserList,
    meta: {
      authRequired: true,
      adminRequired: true,
    },
  },
  {
    path: '/admin/users/new',
    name: 'admin-create-user',
    component: Registration,
    meta: {
      authRequired: true,
      adminRequired: true,
    },
  },
  {
    path: '/admin/users/:user_id',
    name: 'admin-user-profile-preview',
    component: UserProfilePreview,
    meta: {
      authRequired: true,
      adminRequired: true,
    },
  },
  {
    path: '/admin/users/:user_id/edit',
    name: 'admin-user-profile-edit',
    component: UserProfileEdit,
    meta: {
      authRequired: true,
      adminRequired: true,
    },
  },
  {
    path: '/admin/users/:user_id/lists',
    name: 'admin-user-lists',
    component: UserTodoLists,
    meta: {
      authRequired: true,
      adminRequired: true,
    },
  },
  {
    path: '/admin/users/:user_id/lists/:list_id',
    name: 'admin-user-list',
    component: UserTodoList,
    meta: {
      authRequired: true,
      adminRequired: true,
    },
  },

  // Common
  {
    path: '/404',
    name: 'not-found',
    component: NotFoundPage,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.setRouteByUserPermissions = function (route, user) {
  const router = this;
  
  if (route.meta.authRequired && !user.isAuth) {
    router.push({ name: 'login' });
    console.log({ message: 'Router: You are not authenticated' });
  }

  if (route.meta.adminRequired && !user.isAdmin) {
    router.push({ name: 'login' });
    console.log({ message: 'Router: You do not have enough permissions' });
  }

  if (route.meta.guestRequired && user.isAuth) {
    if (user.isAdmin) {
      router.push({ name: 'admin-users' });
    } else {
      router.push({ name: 'lists' });
    }
    console.log({ message: 'Router: You are already logged in' });
  }
};

router.setInitialRouteByUserPermissions = function (route, user) {
  router.setRouteByUserPermissions(route, user);
  router.beforeEach((to) => {
    router.setRouteByUserPermissions(to, user);
  });
};

export default router;
