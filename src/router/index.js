import { createRouter, createWebHistory } from 'vue-router';
import { api } from '../../public/server-api'

import Login from '@/views/Login.vue';
import Registration from '@/views/Registration.vue';
import Activation from '@/views/Activation.vue';
import RestorationEmail from '@/views/RestorationEmail.vue';
import Restoration from '@/views/Restoration.vue';
import DeletedUser from '@/views/DeletedUser.vue';
import GuestList from '@/views/GuestList.vue';
import UserLists from '@/views/UserLists.vue';
import UserList from '@/views/UserList.vue';
import UserProfile from '@/views/UserProfile.vue';
import NotFoundPage from '@/views/common/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: GuestList,
    meta: {
      guestRequired: true,
    },
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
    component: UserProfile,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/lists',
    name: 'lists',
    component: UserLists,
    props: true,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/lists/:listId',
    name: 'list',
    component: UserList,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/admin',
    name: 'admin',
    beforeEnter() {
      window.location.href = api.admin;
    },
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
    meta: {
      hideNav: true,
    }
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
      router.push({ name: 'admin' });
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
