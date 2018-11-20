<template>
    <div class="container">
        <div class="row mt-5">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users Table</h3> 

                <div class="card-tools">
                    <button class="btn btn-success" @click="newModal">Add New 
                        <i class="fa fa-user-plus fa-fw"></i> 
                    </button> 
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Registered At</th> 
                            <th>Type</th>
                            <th>Modify</th>
                        </tr>
        
                        <tr v-for="user in users" :key="user.id">     
                            <td>{{ user.id }}</td> 
                            <td>{{ user.name }}</td>  
                            <td>{{ user.email }}</td>  
                            <td>{{ user.created_at | myDate }}</td>    
                            <td><span class="tag tag-success">{{ user.type | upText }}</span></td>  
                            <td>
                                <a href="#" @click="editModal(user)">
                                  <i class="fa fa-edit text-primary"></i>
                                </a> /
                                <a href="#" @click="deleteUser(user.id)">      
                                  <i class="fa fa-trash text-danger"></i>
                                </a>
                            </td>
                        </tr> 
                </tbody> 
            </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              
              <div class="modal-header">
                <h5 class="modal-title" id="addNewLabel" v-show="!editmode">Add New</h5>
                <h5 class="modal-title" id="addNewLabel" v-show="editmode">Update User's Info</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <form @submit.prevent="editmode ? updateUser() : createUser()"> <!-- prevent for not refresh the page -->
              <div class="modal-body">
                  <div class="form-group">  
                    <input v-model="form.name" type="text" name="name" placeholder="Name" 
                      class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                    <has-error :form="form" field="name"></has-error>
                  </div>   

                  <div class="form-group">  
                    <input v-model="form.email" type="email" name="email" placeholder="Email Address" 
                      class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                    <has-error :form="form" field="email"></has-error>
                  </div>
  
                  <div class="form-group">  
                      <textarea name="bio" v-model="form.bio" id="bio" placeholder="Short bio for user (Optional)" class="form-control" :class="{ 'is-invalid' : form.errors.has('bio') }" cols="30" rows="5"></textarea>
                      </has-error :form="form" field="bio"></has-error>
                  </div>
  
                  <div class="form-group">  
                      <select name="type" id="type" v-model="form.type" class="form-control" :class="{ 'is-invalid' : form.errors.has('type') }">
                        <option value="">Select User Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">Standard User</option>
                        <option value="author">Author</option>
                      </select>
                      </has-error :form="form" field="type"></has-error> 
                  </div>

                  <div class="form-group">   
                       <input v-model="form.password" type="password" name="password" class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                      <has-error :form="form" field="password"></has-error> 
                  </div>
              </div>

              <div class="modal-footer">
                <button type="submit" class="btn btn-danger" data-dismiss="modal">Close</button>
                 <button type="submit" class="btn btn-success" v-show="editmode">Update</button> 
                 <button type="submit" class="btn btn-primary" v-show="!editmode">Create</button> 
              </div>
            </form>
            </div>
          </div>
        </div>
    </div>

</template>

<script>
    export default {
      data() {
        return {
          editmode: false,
          users : {},
          form : new Form({ 
            id: '', 
            name: '',
            email: '',
            password: '',
            type: '',
            bio: '',
            photo: ''
          })
        } 
      },
      methods: {
        newModal() {
          this.editmode = false;  
          this.form.reset(); 
          $('#addNew').modal('show');  
        },
        editModal(user) {  
          this.editmode = true; 
          this.form.reset();  
          $('#addNew').modal('show');  
          this.form.fill(user); 
        },
        updateUser() {
          //console.log('edit');
          this.$Progress.start(); 
          this.form.put('api/user/'+this.form.id)
          .then( () => { 
            $('#addNew').modal('hide'); 
             toast({
                  type: 'success',
                  title: 'Information has been updated',
              });
              this.$Progress.finish(); 
              Fire.$emit('AfterCreate'); 

          } )
          .catch( () => {
              this.$Progress.fail(); 
           } ); 
        } ,
        deleteUser(id) {
            swal({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              if (result.value) {
                
                // Send request to the server
                this.form.delete('api/user/'+id).then( () => {
                  swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  ) 
                  Fire.$emit('AfterCreate');    
                
                }).catch( () => {
                  swal('Failed!', 'There was something wrong.', 'warning'); 
                });

              }
            })
        },
        loadUsers() {
          axios.get('api/user').then( ({data}) => (this.users = data.data) );      
        }, 
        createUser() {
           this.$Progress.start();
           this.form.post('api/user')
           .then(() => {
             Fire.$emit('AfterCreate');  //custom event 
              $('#addNew').modal('hide');    
               toast({
                  type: 'success',
                  title: 'User created in successfully'
              });
             this.$Progress.finish();  
           }) 
           .catch( () => {   
              this.$Progress.fail(); 
           })
           
        }
      },
      created() {
          this.loadUsers();        
          //setInterval( () => this.loadUsers() , 3000);   
          Fire.$on('AfterCreate', () => { 
            this.loadUsers(); // re update the data 
          });
      } 
    }
</script>
