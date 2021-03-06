import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo'; 
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import './App.css';
import 'tachyons';

const particlesOptions = {
  particles: {
    "number": {
      "value": 35,
      "density": {
        "enable": true,
        "value_area": 800
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "repulse"
      }
    }
  } 
}

const initialState = {
  input : '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  },
  hasFace: true
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    const locations = [];
    data.outputs[0].data.regions.forEach(face => {
      let clarifaiFace = face.region_info.bounding_box;
      locations.push({
        leftCol : clarifaiFace.left_col * width,
        topRow : clarifaiFace.top_row * height,
        rightCol : width - (clarifaiFace.right_col * width),
        bottomRow : height - (clarifaiFace.bottom_row * height)
      })
    })
    return locations;
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes})
  } 

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    if(event.target.value === '' || this.state.boxes !== []) {
      this.setState({boxes:[]});
   }
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});
      fetch('https://serene-fortress-71124.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
      .then(response => response.json())
      .then(response => {
        if(response !== "Nil") {
            fetch('https://serene-fortress-71124.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user,{entries:count}))
            })
            this.displayFaceBox(this.calculateFaceLocation(response))
            this.setState({hasFace:true})
        }
        else {
          this.setState({hasFace:false})
        }
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

  render() {
    const {imageUrl, boxes, route, isSignedIn, hasFace} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { (this.state.route === 'home') ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
              hasFace = {hasFace}
            />   
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div> :
          (route === 'signin' || route === 'signout') ?
            <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> :
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />        
        }
      </div>
    );
  }
}

export default App;
