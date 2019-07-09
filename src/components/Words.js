import React from 'react';
// Web사이트 내의 카드 형태의 디자인을 만들기 위한 라이브러리
import Card from '@material-ui/core/Card';
// Card라는 디자인 내에 들어가는 내용
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// Float 버튼
import {withStyles} from '@material-ui/core/styles';
// 화면을 여러개로 분할하여 출력
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
// '+'버튼
import AddIcon from '@material-ui/icons/Add';
// 버튼을 눌렀을 때 화면 상단에 출력되는 window
import Dialog from '@material-ui/core/Dialog';
// Dialog내에서 특정 부분을 처리하도록 설정
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const styles = theme => (
    {
        fab : {
            position: 'fixed',
            bottom: '20px',
            right: '20px'
        }
    }
);

// Firebase의 데이터베이스 URL (JSON형식)
const databaseURL = "https://wordcloud-73426.firebaseio.com";

class Words extends React.Component{
    constructor(){
        super();
        this.state = {
            words: {},
            // Dialog창이 보여지고 있는지 아닌지 상태
            dialog: false,
            word: '',
            weight: ''
        };
    }
    _post(word){
        return fetch(`${databaseURL}/words.json`,{
            method: 'POST',
            body: JSON.stringify(word)
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data =>{
            let nextState = this.state.words;
            nextState[data.name] = word;
            this.setState({words: nextState});
        });
    }
    _delete(id){
        return fetch(`${databaseURL}/words/${id}.json`,{
            method:'DELETE'
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(()=>{
            let nextState = this.state.words;
            delete nextState[id];
            this.setState({words: nextState});
        })
    }
    _get(){
        // Firebase데이터베이스에서 words.json에서 받아옴
        fetch(`${databaseURL}/words.json`).then(res => {
            // status가 200이 아닌경우 에러 페이지로 이동
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            // 정상적으로 수행 되면 받아온 json정보를 반환
            return res.json();
            // 반환 받은 json데이터를 생성자의 words에 반환
        }).then(words => this.setState({words : words}));
    }
    // component가 구동이 된 다음에 자동으로 실행
    componentDidMount(){
        // 페이지가 구성되면 실행
        this._get();
    }
    // dialog의 상태를 true <=> false 로 변경시키는 함수
    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog
    })
    /**
     * 입력 양식에서 단어와 가중치를 입력 후 등록할 때
     * 상태 변화를 통해서 변경된 정보를 화면에 보여주기 위한
     * ValueChange함수
     */
    handleValueChange = (e) =>{
        let nextState = {};
        // 사용자가 입력을 하고있는 name값을 받아와 입력한 값으로 저장
        nextState[e.target.name] = e.target.value;
        // 후 State에 보여주는 방식
        this.setState(nextState);
        if(e.target.value < 1){
            this.setState({weight:1});
        }else if(e.target.value > 9){
            this.setState({weight:9});
        }
    }
    handleSubmit = () => {
        const word = {
            word: this.state.word,
            weight: this.state.weight
        }
        this.handleDialogToggle();

        // 사용자가 입력을 2중 하나라도 하지 않은경우
        if(!word.word && !word.weight){
            return;
        }

        // 등록 함수 호출
        this._post(word);
    }
    handleDelete = (id) =>{
        this._delete(id);
    }
    render(){
        const {classes } = this.props;
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
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography variant="h5" component="h2">
                                                    {word.word}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Button variant="contained" color="primary" onClick = {() => this.handleDelete(id)}>삭제</Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    }
                )}
                <Fab color = "primary" className={classes.fab} onClick={this.handleDialogToggle}>
                    <AddIcon/>
                </Fab>
                <Dialog open={this.state.dialog} onClose = {this.handleDialogToggle}>
                    <DialogTitle>단어 추가</DialogTitle>
                    <DialogContent>
                        <TextField label = "단어" type = "text" name = "word" value = {this.state.word} onChange={this.handleValueChange}/><br />
                        <TextField label = "가중치(1부터 9까지)" type = "number" name = "weight" value = {this.state.weight} onChange={this.handleValueChange}/><br />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Words);