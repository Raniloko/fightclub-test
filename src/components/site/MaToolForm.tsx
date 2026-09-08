export function MaToolForm() {
  return (
    <>
      <iframe
        src="https://ext.matool.de/ptformdyn/?hash=1e769cc33873fa3e"
        id="probeForm"
        scrolling="no"
        frameBorder={0}
        style={{ width: "100%", maxWidth: "700px" }}
      />
      <div
        style={{
          borderTop: "1px solid grey",
          borderColor: "currentColor",
          color: "grey",
          mixBlendMode: "difference",
          paddingTop: "5px",
          paddingBottom: "20px",
          paddingRight: "5px",
          width: "100%",
          maxWidth: "700px",
          textAlign: "right",
        }}
      >
        <a
          href="https://www.matool.de"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "grey",
            mixBlendMode: "difference",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "x-small",
          }}
        >
          made by MATOOL
        </a>
      </div>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `/*<![CDATA[*/function mm(){var n=25;var h=10;var k=0;var d=document.getElementById('probeForm');var f;var b=window.addEventListener?'addEventListener':'attachEvent';var c=window[b];var o=b=='attachEvent'?'onmessage':'message';c(o,function(e){if(e.data===parseInt(e.data)){if(e.data==99999999){var g=function(m,l){var s=document.scrollingElement||document.documentElement,q=s.scrollTop,p=m-q,r=+new Date(),a=function(v,u,x,w){v/=w/2;if(v<1){return x/2*v*v+u}v--;return -x/2*(v*(v-2)-1)+u},i=function(){var v=+new Date();var t=v-r;s.scrollTop=parseInt(a(t,q,p,l));if(t<l){requestAnimationFrame(i)}else{s.scrollTop=m}};i()};g(d.getBoundingClientRect().top+document.documentElement.scrollTop-(Math.max(document.documentElement.clientHeight,window.innerHeight||0)/2),500)}else{f=e.data}}},false);var j=window.setInterval(function(){var a=d.offsetHeight;k=Math.round((f-a)/h);k=Math.abs(k);if(k<1){k=0}if(f>0&&f!=a){if((f-a)>0){d.height=(a+k)+'px'}else{d.height=(a-k)+'px'}}},n)}mm();/*]]>*/`,
        }}
      />
    </>
  );
}
