import React from 'react';
// Web사이트 내의 카드 형태의 디자인을 만들기 위한 라이브러리
import Card from '@material-ui/core/Card';
// Card라는 디자인 내에 들어가는 내용
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Firebase의 데이터베이스 URL (JSON형식)
const databaseRUL = "https://wordcloud-73426.firebaseio.com";

class Words extends React.Component{
    constructor(){
        super();
        this.state = {
            
            words: {}
        };
    }
    _get(){
        // Firebase데이터베이스에서 words.json에서 받아옴
        fetch(`${databaseRUL}/words.json`).then(res => {
            // status가 200이 아닌경우 에러 페이지로 이동
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            // 정상적으로 수행 되면 받아온 json정보를 반환
            return res.json();
            // 반환 받은 json데이터를 생성자의 words에 반환
        }).then(words => this.setState({words : words}));
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextState.words != this.state.words;
    }
    // component가 구동이 된 다음에 자동으로 실행
    componentDidMount(){
        // 페이지가 구성되면 실행
        this._get();
    }
    render(){
        return(
            <div>
                {Object.keys(this.state.words).map(id =>
                    {
                        // Words에 저장 되어있는 Json데이터 처리  
                        const word = this.state.words[id];
                        return(
                            <div key={id}>
                                <Card>
                                    <CardContent>
                                        <Typography color = "textSecondary" gutterBottom>
                                            가중치 : {word.weight}
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                            {word.word}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    }
                )}
            </div>
        );
    }
}

export default Words;