import React from 'react';
// Web사이트 내의 카드 형태의 디자인을 만들기 위한 라이브러리
import Card from '@material-ui/core/Card';
// Card라는 디자인 내에 들어가는 내용
import CardContent from '@material-ui/core/CardContent';

class Detail extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Card>
                <CardContent>
                    {this.props.match.params.textID}
                </CardContent>
            </Card>
        );
    }
}

export default Detail;