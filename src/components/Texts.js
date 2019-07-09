import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
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
// 출력되는 문자열을 간소화시켜 출력 해 주는 모듈
import TextTruncate from 'react-text-truncate';
import Link from '@material-ui/core/Link';

const styles = theme => ({
    hidden:{
        display: 'none'
    },
    fab:{
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
})

// Firebase의 데이터베이스 URL (JSON형식)
const databaseURL = "https://wordcloud-73426.firebaseio.com";

class Texts extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            // 업로드한 file의 이름
            fileName: '',
            // 해당 file에 적혀있는 문장 내용
            // 입력된 내용 자체
            fileContent: null,
            // firebase로부터 받아오는 데이터셋 자체
            texts: {},
            // 각각의 텍스트에대한 id값
            // 사용자가 직접 입력하여 데이터베이스에 추가되도록 함
            textName: '',
            // 텍스트파일을 등록하는 window 상태
            dialog: false
        }
    }
    _delete(id){
        return fetch(`${databaseURL}/texts/${id}.json`,{
            method:'DELETE'
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(()=>{
            let nextState = this.state.texts;
            delete nextState[id];
            this.setState({texts: nextState});
        })
    }
    _post(text){
        return fetch(`${databaseURL}/texts.json`,{
            method: 'POST',
            body: JSON.stringify(text)
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data =>{
            let nextState = this.state.texts;
            nextState[data.name] = text;
            this.setState({texts: nextState});
        });
    }

    _get(){
        // Firebase데이터베이스에서 words.json에서 받아옴
        fetch(`${databaseURL}/texts.json`).then(res => {
            // status가 200이 아닌경우 에러 페이지로 이동
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(texts => this.setState({texts : (texts == null) ? {} : texts}));
    }

    // 바로 실행되는 함수
    componentDidMount(){
        this._get();
    }

    // dialog의 상태를 true <=> false 로 변경시키는 함수
    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog,
        fileName: '',
        fileContent: '',
        textName: ''
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
    }

    handleSubmit = () => {
        const text = {
            textName: this.state.textName,
            textContent: this.state.fileContent
        }
        this.handleDialogToggle();

        // 사용자가 입력을 2중 하나라도 하지 않은경우
        if(!text.textName && !text.textContent){
            return;
        }

        // 등록 함수 호출
        this._post(text);
    }

    handleDelete = (id) =>{
        this._delete(id);
    }

    /**
     * 사용자가 file을 업로드 했을 때 나올 수 있는 함수
     */
    handleFileChange = (e) => {
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.setState({
                fileContent: text
            });
        }
        reader.readAsText(e.target.files[0], "EUC-KR");
        this.setState({
            fileName: e.target.value
        })
    }

    render(){
        const {classes} = this.props;

        return(
            <div>
                {Object.keys(this.state.texts).map(id => {
                    const text = this.state.texts[id];
                    return (
                        <Card key={id}>
                            <CardContent>
                                <Typography color = "textSecondary" gutterBottom>
                                    내용 : {text.textContent.substring(0, 24) + "..."}
                                </Typography>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h5" component = "h2">
                                            {text.textName.substring(0, 14) + "..."}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Link component = {RouterLink} to={"detail/"+id}>
                                            <Button variant = "contained" color="primary">보기</Button>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button variant = "contained" color="primary" onClick={() => this.handleDelete(id)}>삭제</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )
                })}
                <Fab color = "primary" className = {classes.fab} onClick={this.handleDialogToggle}>
                    <AddIcon/>
                </Fab>
                <Dialog open={this.state.dialog} onClose = {this.handleDialogToggle}>
                    <DialogTitle>텍스트 추가</DialogTitle>
                    <DialogContent>
                        <TextField label = "텍스트 이름" type = "text" name = "textName" value = {this.state.textName} onChange={this.handleValueChange}/><br/><br/>
                        <input className={classes.hidden} accept="text/plain" id = "raised-button-file" type = "file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/>
                        <label htmlFor = "raised-button-file">
                            <Button variant = "contained" color="primary" component="span" name = "file">
                                {this.state.fileName === ""? ".txt파일 선택" : this.state.fileName}
                            </Button>
                        </label>
                        <TextTruncate
                            line = {1}
                            truncateText="..."
                            text={this.state.fileContent}
                        />
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

export default withStyles(styles)(Texts);