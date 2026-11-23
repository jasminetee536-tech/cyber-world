import React from 'react';
export default class ErrorBoundary extends React.Component{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 componentDidCatch(error,info){console.error('CYBER WORLD rendering error',error,info?.componentStack)}
 render(){if(this.state.failed)return <main style={{minHeight:'60vh',padding:'clamp(24px,6vw,72px)',background:'#041323',color:'#e8f7ff',fontFamily:'system-ui'}}><p style={{color:'#42ddf7'}}>CYBER WORLD / RECOVERY</p><h1>ページを表示できませんでした</h1><p>一時的な問題が発生しました。ページを再読み込みしてください。</p><button onClick={()=>window.location.reload()} style={{padding:'12px 20px',background:'#0a4963',border:'1px solid #33c8ed',borderRadius:10,color:'#fff'}}>再読み込み</button></main>;return this.props.children}
}