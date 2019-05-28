import React from 'react';
// Web사이트 내의 카드 형태의 디자인을 만들기 위한 라이브러리
import Card from '@material-ui/core/Card';
// Card라는 디자인 내에 들어가는 내용
import CardContent from '@material-ui/core/CardContent';

class Home extends React.Component{
    render(){
        return(
            <Card>
                <CardContent>
                    React 및 Firebase 기반의 워드 클라우드 어플리케이션
                </CardContent>
            </Card>
        );
    }
}

export default Home;