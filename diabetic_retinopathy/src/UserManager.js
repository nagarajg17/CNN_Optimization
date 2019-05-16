import React, {Component} from 'react';
import axios from 'axios';
import {Confidence} from './Confidence'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import image from './bmsce.png';
import './dr.css'

const classData = [{'No dr':0.95},{'Mild DR':0.40},{'Moderate':0.50},{'Severe':0.30},{'Proliferative':0.20}]
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
		report_flag:false,
		confFlag:false,
		leftEyeConfidence:null,
		rightEyeConfidence:null
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
												right_symptoms:response.data.right_eye_symptoms,
											leftEyeConfidence:response.data.left_eye_confidence,
										rightEyeConfidence:response.data.right_eye_confidence})
					
			
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
		confidenceClick =(e)=>{
				this.setState({confFlag:true})
				var modal = document.getElementById("popup1")
				modal.style.display = 'block'
				// this.props.history.push('/confidence/'+classData)
		}
		handleClose = (e)=>{
			this.setState({confFlag:false})
		}
	render(){
		return(
			<div className="full-screen">
			<header>
					<div className="row">
					<img src={image} style={{width:100+"px",height:100+"px",marginLeft:30+"px"}}></img>
					<h2  style={{marginTop:30+"px",marginLeft:10+"%" }}>WELCOME {this.state.name}</h2>
					</div>
				</header>
			{this.state.report_flag?
			<div style={{alignContent:"center"}}>
			<span id='someid'>
			<h3 style={{paddingLeft:30+"px",marginTop:30+"px"}}>AUTOMATED DIABETIC RETINOPATHY DIAGNOSIS PORTAL</h3><br/><br/><br/>
			<h6 style={{paddingLeft:5+"%"}}>Patient ID: {this.state.id}</h6>
			<h6 style={{paddingLeft:5+"%"}}>Patient name: {this.state.name}</h6>
			<h6 id='age' style={{paddingLeft:5+"%"}}>Age: {this.state.age}</h6>
			<h6 id='gender' style={{paddingLeft:5+"%"}}>Gender: {this.state.gender}</h6>
			<h6 style={{paddingLeft:5+"%"}}>Date: {new Date().toLocaleDateString()}</h6>
			<h6 style={{paddingLeft:5+"%"}}>The above patient was checked by the Automated Diabetic Retinopathy Diagnosis
			<br/>Portal. The findings are listed below:</h6><br/><br/>
			<h5 style={{paddingLeft:5+"%"}}>Left Eye: </h5>
			<h6 style={{paddingLeft:5+"%"}}>DR stage: {this.state.left_res} </h6>
			<h6 style={{paddingLeft:5+"%"}}>Symptoms: {this.state.left_symptoms} </h6>
			<h6 style={{paddingLeft:5+"%"}}>Confidence: {this.state.leftEyeConfidence} </h6>
			<h6 style={{paddingLeft:5+"%"}}>Fundus Image: <img src={this.state.left_preview} width={150+"px"} height={150+"px"} id='#blah'></img></h6>
			<h5 id='re' style={{paddingLeft:5+"%"}}>Right Eye: </h5>
			<h6 style={{paddingLeft:5+"%"}}>DR Stage: {this.state.right_res}</h6>
			<h6 style={{paddingLeft:5+"%"}}>Symptoms: {this.state.right_symptoms} </h6>
			<h6 style={{paddingLeft:5+"%"}}>Confidence: {this.state.rightEyeConfidence} </h6>
			<h6 style={{paddingLeft:5+"%"}}>Fundus Image: <img src={this.state.right_preview} width={150+"px"} height={150+"px"} id='#blah'></img></h6><br/><br/><br/><br/>
			<h6 style={{paddingLeft:5+"%"}}>Please visit a doctor and produce this report for further treatment</h6><br/><br/><br/><br/><br/><br/><br/><br/>
		</span></div>:
				<article>
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
				<input type='button' onClick={this.reportClick} value='Test and Generate Report'/><br/>
				</div>
				</form>
				</article>
				}

		<div className="row" style={{marginTop:13+"%"}}>
		<footer>
			<p>&copy;&nbsp;Developed by Harish Chandra G R, Nagraj G and Sumanth Simha, 
				under the guidance of Dr. Indiramma M</p>
		</footer>
		</div>
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
			<div className='form-group form-style full-screen'>
			<div className="row">
				<header>
					<div className="row">
					<img src={image} style={{width:100+"px",height:100+"px",marginLeft:30+"px"}}></img>
					<h2  style={{marginTop:30+"px",marginLeft:10+"%" }}>AUTOMATED DIABETIC RETINOPATHY DIAGNOSIS SYSTEM</h2>
					</div>
				</header>
			{/* <div>
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
			</div> */}
			<article>
				<p><h5><i>This is an automated diabetic retinopathy diagnosis tool. Kindly provide patient information and register</i></h5></p>
				<p><h5><i>Further upload left and right fundus images of the eye in the redirected page.</i></h5></p><p><h5><i> The auto generated report will download after the diagnosis is completed</i></h5></p>
				<br></br><br></br>
  <h3>Enter Patient Details</h3>
  &emsp;
    <form method="post">
      <div style={{display:"center"}}>
        <label><h5>Patient Name</h5></label>
        <input type="text" id="p_id" name="name" onChange={this.handleChange}/>
        <br/><br/>

							<label style={{marginRight:50+"px"}}><h5>Gender</h5></label>
						<label style={{width:30+"px"}}><h7>Male</h7></label>
						<input type="radio" name="gender" value="Male" onChange={this.handleChange} style={{marginRight:45+"px"}}/>
						<label style={{width:50+"px"}}><h7>Female</h7></label>
						<input type="radio" name="gender" value="Female" onChange={this.handleChange}/>
								<br/><br/>
        <label><h5>Age</h5></label>
        <input type="text" id="Age" name="age" onChange={this.handleChange}/>
        <br /><br/>
        <label></label>
        <button type="submit" onClick={this.handleSubmit}>REGISTER</button>
      </div>
    </form>
</article>
		</div>
		<div className="row" style={{marginTop:13+"%"}}>
		<footer>
			<p>&copy;&nbsp;Developed by Harish Chandra G R, Nagraj G and Sumanth Simha, 
				under the guidance of Dr. Indiramma M</p>
		</footer>
		</div>
			</div>

			)
	}
}





