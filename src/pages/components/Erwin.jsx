import { useState, useEffect } from "react";

function Erwin(props){
	return (
		<div id='modal'>
			<div 
				id='modal-el' 
				className={props.closing 
				? `modal-out ${props.error ? 'error' : 'message'}`
				: `${props.error ? 'error' : 'message'}`}
			>
				<h3>
  {props.error ? "Ошибка" : "Сообщение"}
  <span id='closebutton' onClick={() => {props.closemodal()}}>×</span>
</h3>
				<p>{props.text}</p>
			</div>
		</div>
	)
}

export default Erwin;