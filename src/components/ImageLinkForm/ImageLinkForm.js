import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({ onInputChange, onButtonSubmit, hasFace }) => {
	return (
		<div>
		 <p className='f3'>
		 	{ 'This magic brain will detect faces in your pictures. Give it a try!'}
		 </p>
		 <p className='f3'>
           { 'Copy the image address from google images or anywhere and paste it here.'}
        </p>
        <p className='f6'>
        	{ 'Note: url starts with http(s) and not data: '}
        </p>
        { (!hasFace) ?
           <div className="">
	           <p className='f3 bg-white'>
                   { 'No Faces Detected'}
               </p>
               </div> :
          <div></div>}
		 <div className='center'>
		 	<div className='form center pa4 br3 shadow-5'>
			 	<input className='f4 pa2 w-70 center' type='text' onChange={onInputChange} />
			 	<button
			 		onClick={onButtonSubmit} 
			 		className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple pointer'>Detect</button>
		 	</div>
		 </div>
		</div>
	)
}

export default ImageLinkForm;