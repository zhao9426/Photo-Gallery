import React,{Component} from 'react';
import ReactDOM from 'react-dom';
require('normalize.css/normalize.css');
require('styles/App.css');
//获取图片相关的数据
let imageDatas = require('json!../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息

imageDatas = ((imageDatasArr) => {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//获取区间内的一个随机值
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

/* 
获取0-30°之间的正负值
 */
var get30DegRandom=()=>{
 return ((Math.random()>0.5 ? '' : '-')+Math.ceil(Math.random()*30));
}
//单个图片组件
class ImgFigure extends React.Component{
  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);
  }
  /* 
  imgFigure的点击处理函数
   */
  handleClick(e){
    let index = this.props.index
   
    if(this.props.arrange.isCenter){
      this.props.inverse(index);
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    var styleObj={};
    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }
    //如果图片的旋转角度有值并且不为0.添加旋转角度
    if(this.props.arrange.rotate){
      (['moz','ms','webkit','']).forEach((value)=>{
        styleObj[value+'transform']='rotate('+this.props.arrange.rotate+'deg';
      });
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex=11;
    }
    let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';
    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
        alt={this.props.data.title} style={{width:240,height:240}}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>

      </figure>
    );
  }
}
//控制主键
class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);
  }

  handleClick(e){
    //如果点击是当前正在选中态的按钮，则翻转图片，否则将对应的图片剧中
    console.log(this.props,"hskjcx");
    if(this.props.arrange.isCenter){
      console.log(this.props.inverse());
    }else{
      console.log(this.props.center());
    }
    e.preventDefault();
    e.stopPropagation();
  }
  render(){
    var controllerUnitClassName="controller-unit";
    //如果对应的是剧中的图片，显示控制按钮的剧中态
    if(this.props.arrange.isCenter){
      controllerUnitClassName+="is-center";
      //如果同时对应的是翻转图片，显示控制按钮的翻转态
      if(this.props.arrange.isInverse){
        controllerUnitClassName+="is-inverse";
      }
    }
    return(
      <span className={controllerUnitClassName} onClick={this.handleClick}>
        <img src="../images/rigth.png" alt=""  className="xuanzhuanimg"/>
      </span>
    );
  }
}
class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this. Constant={
      centerPos:{
        left:0,
        right:0,
      },
      hPosRange:{//水平方向的取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{//垂直方向的取值范围
        x:[0,0],
        topY:[0,0]
      }
    };
    this.state={
      imgsArrangeArr:[
     /*  {
        pos:{
          left:'0',
          top:'0'
        } ,
        rotate:0,//旋转角度
        isInverse:false,//图片正反面
        isCenter:false,//图片是否居中
      } */
    ]
  };
  }

   /* 
    翻转图片
    @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
    @return {Function}这是一个闭包函数，其内return一个真正待被执行的函数
     */
    
  inverse(index) {
    console.log(index, "r")
      let imgsArrangArr = this.state.imgsArrangeArr;
      imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangArr
      },()=> console.log(this.state, "inv")) 
  }
  /* 
  重新布局所有图片
  centerIndex 指定剧中排布哪个图片
   */
  rearrange(centerIndex){
    var imgsArrangeArr=this.state.imgsArrangeArr,
    Constant=this.Constant,
    centerPos=Constant.centerPos,
    hPosRange=Constant.hPosRange,
    vPosRange=Constant.vPosRange,
    hPosRangeLeftSecX=hPosRange.leftSecX,
    hPosRangeRightSecX=hPosRange.rightSecX,
    hPosRangeY=hPosRange.y,
    vPosRangeTopY=vPosRange.topY,
    vPosRangeX=vPosRange.x,
    imgsArrangeTopArr=[],
    topImgNum=Math.floor(Math.random()*2),//取一个或者不取
    topImgSpliceIndex=0,
    imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);
    //首先剧中centerIndex的图片,剧中的centerIndex的图片不需要旋转
    imgsArrangeCenterArr[0]={
      pos:centerPos,
      rotate:0,
      isCenter:true
    };
    //取出要布局上侧的图片状态信息
    topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
    imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value,index)=>{
      imgsArrangeTopArr[index]={
        pos:{
          top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false,
      }
    });
    //布局左右两侧图片
  for( var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
    var hPosRangeLORX=null;
    //前半部分布局左边，右半部分布局右边
    if(i<k){
      hPosRangeLORX=hPosRangeLeftSecX;
    }else{
      hPosRangeLORX=hPosRangeRightSecX;
    }
    imgsArrangeArr[i]={
      pos:{
        top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
        left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
      },
      rotate:get30DegRandom(),
      isCenter:false
    };  
    }
    if(imgsArrangeTopArr&&imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr:imgsArrangeArr
    });
  }
  /* 
  利用 rearrange函数，剧中对应index图片
  @param index，需要被居中的图片对应图片信息数组的index值
  return {Function}
   */
  center(index){
    return ()=>{
      this.rearrange(index);
    }
  }
  //组件加载好后，为每张图片计算其位置范围
  componentDidMount(){
    //首先拿到舞台的大小

    var stageDOM=ReactDOM.findDOMNode(this.refs.stage),
      stageW=stageDOM.scrollWidth,
      stageH=stageDOM.scrollHeight,
      halfStageW=Math.ceil(stageW/2),
      halfStageH=Math.ceil(stageH/2);
     
      //拿到一个imageFigure的大小
    var imgFigureDOM=ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW=imgFigureDOM.scrollWidth,
      imgH=imgFigureDOM.scrollHeight,
      halfImgW=Math.ceil(imgW/2),
      halfImgH=Math.ceil(imgH/2);
      //计算中心图片的位置点
    this.Constant.centerPos={
      left:halfStageW-halfImgW,
      top:halfStageH-halfImgH
    }
      //计算左侧图片的位置点的取值范围
    this.Constant.hPosRange.leftSecX[0]=-halfImgW;
    this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW*3;
      //计算右侧图片的位置点的取值范围
    this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
    this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
    this.Constant.hPosRange.y[0]=-halfImgH;
    this.Constant.hPosRange.y[1]=stageH-halfImgH;
      //计算顶部图片位置的取值范围
    this.Constant.vPosRange.topY[0]=-halfImgH;
    this.Constant.vPosRange.topY[1]=halfStageH-halfImgH*3;
    this.Constant.vPosRange.x[0]=halfStageW-imgW;
    this.Constant.vPosRange.x[1]=halfStageW;
    this.rearrange(0);
  }
  render() {
    var controllerUnits=[],
    imageFigures=[];
    imageDatas.forEach((value,index)=>{
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        };
      }
      imageFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index}
                                   arrange={this.state.imgsArrangeArr[index]} 
                                   inverse={this.inverse.bind(this,index)}
                                   center={this.center(index)}/>);
      controllerUnits.push(<ControllerUnit  data={value} key={index}
                                   arrange={this.state.imgsArrangeArr[index]} 
                                   index={index}
                                   inverse={this.inverse.bind(this,index)}
                                   center={this.center(index)}/>);
    })
    return (
      <section className="stage" ref="stage"> 
        <section className="img-sec">{imageFigures}</section>
        <nav className="controller-nav">
          {controllerUnits}
          </nav>
      </section>
    );
  }
}


export default AppComponent;
