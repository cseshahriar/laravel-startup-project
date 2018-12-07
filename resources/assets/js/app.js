
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue'); 

import moment from 'moment';
//Vue.use(require('vue-moment'));    

// vform
import { Form, HasError, AlertError } from 'vform';
window.Form = Form;

// global components
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
Vue.component('pagination', require('laravel-vue-pagination'));

import Gate from './Gate';
Vue.prototype.$gate = new Gate(window.user);  

// VueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// VueProgressBar
import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '5px' 
})

//sweetalert2
import swal from 'sweetalert2'
window.swal = swal; 
const toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
window.toast = toast; 


let routes = [
  { path: '/dashboard', component:require('./components/Dashboard.vue')},
  { path: '/developer', component:require('./components/Developer.vue')},
  { path: '/profile', component: require('./components/Profile.vue')},
  { path: '/users', component: require('./components/Users.vue')},
  { path: '*', component: require('./components/NotFound.vue')}
]

const router = new VueRouter({
	mode: 'history',
    routes 
})
// global filter
Vue.filter('upText', function(text) {
	return text.charAt(0).toUpperCase() + text.slice(1) 

});  

Vue.filter('myDate', function(createdAt) {
	return moment(createdAt).format('MMMM Do YYYY');    
}); 

// global vue instance 
//let Fire = new Vue(); 
window.Fire = new Vue();   

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));

Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue')
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue')
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue') 
);

Vue.component(
    'not-found',
    require('./components/NotFound.vue') 
);

const app = new Vue({
  el: "#app", 
  router,
  data: {
    search : '' 
  },
  methods: {
    searchit: _.debounce( () => {
      Fire.$emit('searching'); // create custom event
     }, 1000)  
  }
});
