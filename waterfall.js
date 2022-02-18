import React from 'react'
import Masonry from 'masonry-layout'
import InfiniteScroll from 'react-infinite-scroller'
import imagesLoaded from 'imagesloaded'
import axios from 'axios'
import qs from 'qs'
import cs from 'classnames'

const arr = [
  'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3008142408,2229729459&fm=26&gp=0.jpg',
  'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3437217665,1564280326&fm=26&gp=0.jpg',
  'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2458227883,4095122505&fm=26&gp=0.jpg',
  'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1761250919,1896060533&fm=26&gp=0.jpg',
  'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2852083094,372235004&fm=26&gp=0.jpg',
  'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2944705163,3932100810&fm=26&gp=0.jpg',
  'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3104686528,572431609&fm=26&gp=0.jpg',
]

// columnWidth: 200,
// itemSelector: '.grid-item' // 要布局的网格元素
// gutter: 10 // 网格间水平方向边距，垂直方向边距使用css的margin-bottom设置
// percentPosition: true // 使用columnWidth对应元素的百分比尺寸
// stamp:'.grid-stamp' // 网格中的固定元素，不会因重新布局改变位置，移动元素填充到固定元素下方
// fitWidth: true // 设置网格容器宽度等于网格宽度，这样配合css的auto margin实现居中显示
// originLeft: true // 默认true网格左对齐，设为false变为右对齐
// originTop: true // 默认true网格对齐顶部，设为false对齐底部
// containerStyle: { position: 'relative' } // 设置容器样式
// transitionDuration: '0.8s' // 改变位置或变为显示后，重布局变换的持续时间，时间格式为css的时间格式
// stagger: '0.03s' // 重布局时网格并不是一起变换的，排在后面的网格比前一个延迟开始，该项设置延迟时间
// resize:  false // 改变窗口大小将不会影响布局
// initLayout: true // 初始化布局，设未true可手动初试化布局

export default class extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      hasMore: true, // 是否开启下拉加载
      data: [], // 接受我每次的数据
      count: 0, // 下拉加载
    }

    this.loadMoreData()
  }

  imagesOnload = () => {
    const elLoad = imagesLoaded('.pages-hoc') // 获取最外层的盒子

    elLoad.on('always', () => {
      // 图片加载后执行的方法
      // 拿第一次的数据
      this.advanceWidth()
    })
    // elLoad.on( 'done', () => {
    //     // 图片加载后执行的方法
    //     console.log('图片加载成功')
    // } )
    // elLoad.on( 'fail', option => {
    //     // 图片加载后执行的方法
    //     console.log('图片加载失败', option)
    // } )
  }

  advanceWidth = () => {
    // new Masonry(节点, 配置)
    new Masonry(document.querySelector('.pages-hoc'), {
      itemSelector: '.d', // 要布局的网格元素
      columnWidth: 10, // 获取节点 可以自动计算每列的宽度
      fitWidth: true, // 设置网格容器宽度等于网格宽度
      gutter: 20,
    })
  }

  // 加载更多数据
  loadMoreData = (page = 1) => {
    // page 当前滚动到了第几页
    const { data, count } = this.state
    // 超过200条数据 不继续监听下拉事件
    if (count && data.length >= count) {
      return false
    }
    // page 是当前请求第几页数据
    // limit 每页我需要返回的数据条数
    axios.post('https://blogs.zdldove.top/Home/Apis/listWithPage', qs.stringify({ page, limit: 20 }))
      .then(res => {
        this.setState({
          data: [...data, ...arr], // 拼接每次加载的数据 arr是我自定义的数据
          count: res.data.result.count,
        }, () => {
          this.imagesOnload() // 每次获取完数据 触发
        })
      })
      .catch(err => console.log(err))
  }

  render () {
    const { hasMore } = this.state
    console.log(this.state.data, '--this.state.data--')
    return (
      <div className="box" style={{ border: '1px solid red' }}>
        {/* 下拉加载 */}
        <InfiniteScroll
          initialLoad={false} // 不让它进入直接加载
          pageStart={1} // 设置初始化请求的页数
          loadMore={this.loadMoreData} // 监听的ajax请求
          hasMore={hasMore} // 是否继续监听滚动事件 true 监听 | false 不再监听
          useWindow={true} // 不监听 window 滚动条
        >
          <div className="pages-hoc">
            {
              this.state.data.map((value, key) => (
                <div
                  key={key}
                  className={cs('d', { d1: key % 2 === 0, d2: key % 2 !== 0 })} // 添加类名 修改样式
                >
                  <img src={value} key={key} />
                  <p>1sdgdsgd是得给对方个</p>
                </div>
              ))
            }
          </div>
        </InfiniteScroll>
      </div>
    )
  }
}

