/**
 * listview
 * @author lvyan
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class listview extends cc.Component {
    @property(cc.Prefab) itemPrefab:cc.Prefab = null;

    @property itemCount:number = 0;                     //实际需求要创建的item个数

    _space : number = 20;                               //item间隙距离
    _limitCount : number = 0;                          //最大个数（需计算）
    _itemH : number = 0;
    _itemArr : any = [];                                //存放item的数组
    _content = null;
    _predistance : number = 0;

    // onLoad () {}

    start () {
        this._content = this.node.getComponent(cc.ScrollView).content;  //获取item容器
        console.log("content====>", this._content.y);
        let item = cc.instantiate(this.itemPrefab);
        this._itemH = item.height;

        this.getLimitCount();
        console.log("content====>", this._content.y);
        this.initListview();
        this.jumpItem(17);
    }

    

    /**
     * 获取最大显示个数
     */
    getLimitCount(){
        if(this.node.height%(this._itemH+this._space) === 0){   //view刚好显示整数个item
            this._limitCount = Math.floor(this.node.height/(this._itemH+this._space))+2;
        }else{                                   //view显示有某个item不完整
            this._limitCount = Math.floor(this.node.height/(this._itemH+this._space))+3;
        }
        if(this.itemCount < this._limitCount){
            this._limitCount = this.itemCount;
        }
        console.log("创建了几个", this._limitCount)
    }

    /**
     * 初始化listview
     */
    initListview(){
        console.log("content====>", this._content.y);
        // this._content.height = 100;
        this._content.height = this.itemCount * (this._itemH + this._space);
        console.log("content====>", this._content.y);
        console.log("this._content.height=============>",this._content.height);
        console.log("content====>", this._content.y);
        for(let i = 0; i < this._limitCount; i++){
            let item = cc.instantiate(this.itemPrefab);
            item.setPosition(0, -i*(this._itemH + this._space));
            item.getChildByName("index").getComponent(cc.Label).string = String(i+1);
            this._itemArr.push(item);
            this._content.addChild(item);
        }
        console.log("content====>", this._content.y);
    }

    /**
     * 根据滑动修改item的信息及位置
     */
    modifyItem () {
        let distance = Math.floor(this._content.y);                    //当前y距离
        let num = Math.floor(distance/(this._itemH + this._space));    //算有多少个item已被上面隐藏
        if(num === 0){                                                  //最原始item状态
            return;
        }
        num = num -1 ;                                                  
        if(distance > this._predistance){//往下叠加
            
            if(num+this._limitCount+1 > this.itemCount){                //将要替换的item超出了原始想要创建的个数
                return;
            }
            console.log( num, num%this._limitCount,"变成了", num+this._limitCount+1);
            this.itemChange(this._itemArr[num%this._limitCount], {index:num+this._limitCount+1});
        }else if(distance < this._predistance){//往上叠加
            if(num+1 < 0){                //将要替换的item超出了原始想要创建的个数
                return;
            }
            console.log( num, num+this._limitCount,"变成",num+1 );
            this.itemChange(this._itemArr[(num+this._limitCount)%this._limitCount], {index:num+1});
        }
        this._predistance = distance;
    }

    /**
     * 更新item的内容及位置
     */
    itemChange(item:cc.Node, info:any){
        if(!item || !info || !info.index){
            console.log("值为空",item , info , info.index);
            return;
        }
        item.getChildByName("index").getComponent(cc.Label).string = info.index;
        item.setPosition(0, -(info.index-1)*(this._itemH + this._space));
    }

    /*
    *跳到指定item
    *@params index:是指真实index
    */
    jumpItem(index:number){
        if(this.itemCount < index){
            return;
        }
        var start = 0;
        if(index + this._limitCount <= this.itemCount){
            start = index-1;
        }else{
            start = this.itemCount-4;
        }
        for (var i = start; i < start+this._limitCount; i++) {
            console.log("数据初始化", (i-1)%this._limitCount, i)
            this.itemChange(this._itemArr[(i-1)%this._limitCount], {index:i});
        }
        this._content.y = (this._itemH + this._space)*(index-1);
    }

    // update (dt) {}
}


