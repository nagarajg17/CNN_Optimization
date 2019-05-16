import React, {Component} from 'react';
import  BarChart from 'react-bar-chart';

export class Confidence extends Component{

    render(){
        let plot = this.props.match.params.id
        console.log(this.props.match.params.id)
        return(
            <BarChart ylabel='Quantity'
                  width={100}
                  height={500}
                  data={plot}
                  />
        )


    }
}