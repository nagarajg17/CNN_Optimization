import React, {Component} from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './dr.css'
import Fullscreen from "react-full-screen";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


export class UserPrediction extends Component{
	
	state={
		left:null,
		right:null,
		left_res :'',
		left_symptoms:'',
		right_res : '',
		right_symptoms:'',
		id:'',
		name:'',
		age:'',
		gender:'',
		left_preview:null,
		right_preview:null,
		report_flag:false
	}
	
	handleFile = (e)=>{
		// if (e.target.name=='left') {
			const $ = window.$;
			this.setState({
				[e.target.name]:e.target.files[0],
				[e.target.id]:URL.createObjectURL(e.target.files[0])
			})


	}

	handleClick = (e)=>{

		let left_eye = this.state.left
		let right_eye = this.state.right

		let form_data = new FormData()
		form_data.append('left_eye', left_eye)
		form_data.append('right_eye', right_eye)
		axios({
			url:'http://localhost:8000/dr/predict/',
			method:'POST',
			data:form_data

		}).then(response=>{
			console.log('Test Response', response.data)
			this.setState({left_res:response.data.left_eye_result,
									right_res:response.data.right_eye_result,
							})
		})	

	}

	report_template = false;

	reportClick = (e)=>{

		if(this.state.left && this.state.right){

			let left_eye = this.state.left
			let right_eye = this.state.right
			this.setState({
				report_flag:true
			})
			let form_data = new FormData()
			form_data.append('left_eye', left_eye)
			form_data.append('right_eye', right_eye)
			console.log('POST images', left_eye,right_eye)
					axios({
						url:'http://localhost:8000/dr/predict/',
						method:'POST',
						data:form_data
			
					}).then(response=>{
						console.log('Test Response', response.data)
						this.setState({left_res:response.data.left_eye_result,
												right_res:response.data.right_eye_result,
												left_symptoms:response.data.left_eye_symptoms,
												right_symptoms:response.data.right_eye_symptoms})
					
			
						const input = document.getElementById('someid');
						html2canvas(input)
						.then((canvas) => {
						const imgData = canvas.toDataURL('image/png');
						const pdf = new jsPDF();
						pdf.addImage(imgData, 'JPEG', 0.2, 0.2);
						pdf.output('dataurlnewwindow');
						pdf.save("Patient_"+this.state.id+".pdf");
										  });
					})
		}}

		componentWillMount(){
			let id = parseInt(this.props.match.params.id)
			console.log(this.props.match.params.id)
			axios.get(`http://localhost:8000/users/?id=${id}`)
			.then((response)=>{
				this.setState({
					id:response.data.id,
					name:response.data.name,
					age:response.data.age,
					gender:response.data.gender,
				})
			});
		}

	render(){
		return(
			<div>
				<div style={{paddingLeft:20+"px"}}><h2 style={{backgroundColor:"dodgerblue",color:"black",fontSize:37+"px"}}>Welcome {this.state.name}!</h2></div><br/><br/>
				<form encType='multipart/form-data'>
				<div className='form-style'>
				<label className='text-style'>Left Eye</label>
				<input type='file' name='left' onChange={this.handleFile} style={{paddingBottom:155+"px"}} id='left_preview'/><img src={this.state.left_preview} width={150+"px"} height={150+"px"} id='#blah'></img><br/>
				</div>
				<div className='form-style'>
				<label className='text-style'>Right Eye</label>
				<input type='file' name='right' onChange={this.handleFile} style={{paddingBottom:155+"px"}} id='right_preview'/><img src={this.state.right_preview} width={150+"px"} height={150+"px"} id='#blah'></img><br/>
				</div>
				<div className='form-style'>
				<input type='button' onClick={this.reportClick} value='Test and Generate Report' className='btn' style={{backgroundColor:"dodgerblue", color:"black"}}/><br/>
				</div>
			</form>
			{this.state.report_flag?
			<span id='someid'>
			<h3 style={{paddingLeft:20+"px"}}>AUTOMATED DIABETIC RETINOPATHY DIAGNOSIS PORTAL</h3><br/><br/><br/>
			<h5 style={{paddingLeft:5+"%"}}>Patient ID: {this.state.id}</h5>
			<h5 style={{paddingLeft:5+"%"}}>Patient name: {this.state.name}</h5>
			<h5 id='age' style={{paddingLeft:5+"%"}}>Age: {this.state.age}</h5>
			<h5 id='gender' style={{paddingLeft:5+"%"}}>Gender: {this.state.gender}</h5>
			<h5 style={{paddingLeft:5+"%"}}>Date: {new Date().toLocaleDateString()}</h5>
			<h5 style={{paddingLeft:2+"%"}}>The above patient was checked by the Automated Diabetic Retinopathy Diagnosis
			<br/>Portal. The findings are listed below:</h5><br/><br/>
			<h4 style={{paddingLeft:5+"%"}}>Left Eye: </h4>
			<h5 style={{paddingLeft:5+"%"}}>DR stage: {this.state.left_res} </h5>
			<h5 style={{paddingLeft:5+"%"}}>Symptoms: {this.state.left_symptoms} </h5>
			<h4 id='re' style={{paddingLeft:5+"%"}}>Right Eye: </h4>
			<h5 style={{paddingLeft:5+"%"}}>DR Stage: {this.state.right_res}</h5>
			<h5 style={{paddingLeft:5+"%"}}>Symptoms: {this.state.right_symptoms} </h5><br/><br/><br/><br/>
			<h5 style={{paddingLeft:5+"%"}}>Please visit a doctor and produce this report for further treatment</h5><br/><br/><br/><br/><br/><br/><br/><br/>
			<h3 style={{paddingLeft:20+"%"}}>HAVE A NICE DAY!!</h3>
		</span>:null}
		
			</div>
			)

	}
}


export class UserRegistration extends Component{
	
	state={
		name:'',
		age:'',
		gender:'',
	}
	reg_flag='';
	handleChange=(event)=>{
		this.setState({
			[event.target.name]:event.target.value
		})
		// console.log(event.target.files[0].name)
	}

	handleSubmit =(event)=>{
		event.preventDefault()
		let storeURL='http://127.0.0.1:8000/users/';
		let name=this.state.name
		let age=this.state.age
		let gender = this.state.gender
		let json_data = {"name":name,"gender":gender,"age":age}
		console.log(json_data)
		axios.post(storeURL, json_data
			).then(response=> 
			{
				console.log(response)
			// this.reg_flag='retina_test'+name+Math.random()
			this.props.history.push('/test/'+response.data.id)}
			)
			.catch(err => console.log(err))
		console.log("post data",this.state)
	}


	render(){
		return(
			<div className='form-group row form-style'>
			<div>
			<div style={{paddingLeft:20+"px"}}><h2 style={{backgroundColor:"dodgerblue",color:"black",fontSize:37+"px"}}>DIABETIC RETINOPATHY DIAGNOSIS PORTAL</h2></div><br/><br/>
			<form onSubmit={this.handleSubmit} method="post">
				<div className='form-style'>
				<label className='text-style'>Name</label>&nbsp;&nbsp;&nbsp;
				<input type='text' name='name' onChange={this.handleChange} className='form-control' style={{width:300+"px"}}/><br/><br/><br/>
				</div>
				<div className='form-style'>
				<label className='text-style'>Age</label>&nbsp;&nbsp;&nbsp;
				<input type='text' name='age' onChange={this.handleChange} className='form-control' style={{width:300+"px"}}/><br/><br/><br/>
				</div>
				<div className='form-group form-style'>
				<label className='text-style'>Gender</label>&nbsp;&nbsp;&nbsp;
				<input type='text' name='gender' onChange={this.handleChange} className='form-control input-sm' style={{width:300+"px"}}/><br/><br/><br/>
				</div>
				<div className='form-group form-style'>
				<input type='submit' onSubmit={this.handleSubmit} value='Register' className='btn' style={{backgroundColor:"dodgerblue",color:'white'}}/>
				</div>
			</form>	
			</div>
			</div>

			)
	}
}





