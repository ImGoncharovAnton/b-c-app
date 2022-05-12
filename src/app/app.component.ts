import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/service/auth.service';
import {DataService} from './shared/service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: any
  posts: any

  constructor(private authService: AuthService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.authService.autoLogin()
    // this.dataService.fetchUser().subscribe(data => this.data = data)
    // this.getPosts()
  }

//   createPost() {
//     // const post = [
//     //   {title: 'title1', content: 'content1'},
//     //   {title: 'title2', content: 'content2'},
//     //   {title: 'title3', content: 'content3'},
//     //   {title: 'title4', content: 'content4'},
//     // ]
//     const post = {title: 'title5', content: 'content5'}
//     this.dataService.createPost(post).subscribe(response => {
//       this.getPosts()
//     })
//   }
//
//   getPosts() {
//     this.dataService.fetchPost().subscribe(response => {
//       this.posts = response
//     })
//   }
//
//
//   addData() {
//     let months = [
//       {'key1': 'value1'},
//       {'key2': 'value2'}]
//     // this.dataService.addUserMonths(months).subscribe((data) => {
//       //   console.log("test")
//     // })
//     // console.log('AddData complited')
//   }
//
//   fetchData() {
//
//     console.log('fetchUser complete', this.data)
//   }
//
//   setDataUser() {
//     console.log(this.dataService.setUserId())
//     // const a = this.dataService.dataUser()
//     // console.log('user from data service', a)
//   }
}
