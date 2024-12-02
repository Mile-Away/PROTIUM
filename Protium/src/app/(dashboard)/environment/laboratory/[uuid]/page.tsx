'use client';
import * as echarts from 'echarts';
import { useCallback, useEffect, useRef, useState } from 'react';
import './page.css';

function App() {
  const [process, setProcess] = useState(0);
  const [pumps, setPumps] = useState<any>({});
  const [rotavap, setRotavap] = useState<any>({});
  const [separator, setSeparator] = useState<any>({});
  const echartDom = useRef<any>();
  const echart = useRef<any>();
  const ecahrtsData = useRef<any>({
    times: [],
    material: [],
    reactor: [],
    materialWarning: 0,
    reactorWarning: 0,
    max: 0,
  });

  const refreshEcharts = useCallback((props: any) => {
    const { times, material, reactor, materialWarning, reactorWarning, max } =
      props;
    console.log(materialWarning, reactorWarning);
    echart.current.setOption({
      legend: {
        textStyle: {
          color: '#FFFFFF',
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times,
        axisLabel: {
          color: '#B1C1FF',
        },
      },
      yAxis: {
        max,
        type: 'value',
        axisLabel: {
          color: '#B1C1FF',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(228, 242, 255, 0.4)',
          },
        },
      },
      series: [
        {
          name: '材料温度',
          data: material,
          type: 'line',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0.5, 0, 0.5, 1, [
              { offset: 0, color: '#EF3AFB' },
              { offset: 1, color: '#151339' },
            ]),
          },
          smooth: true,
          markLine: {
            symbol: 'none',
            label: {
              fontSize: 12,
              formatter: '材料警戒温度',
              position: 'middle',
              color: '#D0248B',
            },
            lineStyle: {
              color: '#D0248B',
              type: 'solid',
            },
            data: [
              {
                yAxis: materialWarning,
                symbol: 'none',
              },
            ],
          },
        },
        {
          name: '反应温度',
          data: reactor,
          type: 'line',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0.5, 0, 0.5, 1, [
              { offset: 0, color: '#EF3AFB' },
              { offset: 1, color: '#151339' },
            ]),
          },
          smooth: true,
          markLine: {
            symbol: 'none',
            label: {
              fontSize: 12,
              formatter: '反应警戒温度',
              position: 'middle',
              color: '#D0248B',
            },
            lineStyle: {
              color: '#D0248B',
              type: 'solid',
            },
            data: [
              {
                yAxis: reactorWarning,
                symbol: 'none',
              },
            ],
          },
        },
      ],
      grid: [
        {
          top: '10%',
          width: '85%',
          height: '80%',
          left: '10%',
        },
      ],
    });
  }, []);
  const resize = useCallback(() => echart?.current?.resize(), []);

  useEffect(() => {
    // @ts-ignore
    const ws = new WebSocket("ws://172.21.7.153:9090");
    ws.onopen = function (evt) {
      ws.send(JSON.stringify({ op: 'subscribe', topic: '/dev_data' }));
    };

    ws.onmessage = function (evt) {
      const rep = JSON.parse(evt.data);
      const maxPoint = 1000;
      if (rep.msg.data) {
        const data = JSON.parse(rep.msg.data);
        setProcess(+data.PumpBackbone.process.percentage);
        setPumps(data.PumpBackbone.pumps);
        setRotavap(data.PumpBackbone.rotavap_controller);
        setSeparator(data.PumpBackbone.separator_controller);
        const [date, time] = data.data_time.split(',');
        ecahrtsData.current.times.push(time);
        ecahrtsData.current.times.splice(
          0,
          ecahrtsData.current.times.length > maxPoint ? maxPoint / 2 : 0,
        );
        ecahrtsData.current.material.push(
          data.PumpBackbone.temperatures.temperature_material.value,
        );
        ecahrtsData.current.material.splice(
          0,
          ecahrtsData.current.material.length > maxPoint ? maxPoint / 2 : 0,
        );
        ecahrtsData.current.reactor.push(
          data.PumpBackbone.temperatures.temperature_reactor.value,
        );
        ecahrtsData.current.reactor.splice(
          0,
          ecahrtsData.current.reactor.length > maxPoint ? maxPoint / 2 : 0,
        );
        ecahrtsData.current.materialWarning =
          data.PumpBackbone.temperatures.temperature_material.warning;
        ecahrtsData.current.reactorWarning =
          data.PumpBackbone.temperatures.temperature_reactor.warning;
        ecahrtsData.current.max = +data.max_temp;

        refreshEcharts(ecahrtsData.current);
      }
    };

    ws.onclose = function (evt) {
      console.log('Connection closed.');
    };

    if (echartDom.current) {
      echart.current = echarts.init(echartDom.current);
    }

    window.addEventListener('resize', resize);

    return () => {
      ws.close();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="app">

      <div className="main ">
        <div className="main-left">
          <div className="panel" style={{ flex: 1 }}>
            <div className="panel-title">当前任务</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <img
                style={{ width: '100%' }}
                src="/static/media/progress.gif"
                alt=""
              />
            </div>
            <div className="progress">
              <span>进度</span>
              <span style={{ fontSize: 48 }}>{process}%</span>
            </div>
          </div>
          <div className="panel" style={{ flex: 2 }}>
            <div className="panel-title">反应温度</div>
            <div
              ref={echartDom}
              className="panel-main"
              style={{ flex: 1 }}
            ></div>
          </div>
        </div>
        <div className="main-right">
          <div className="main-right-header">
            <div
              className="panel"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <div className="panel-title panel-title-absolute">当前状态</div>
              <div className="panel-middle" style={{ marginTop: 12 }}>
                <img
                  src="/static/images/shiguan.png"
                  width={39}
                  height={68}
                  alt=""
                />
                <div className="panel-title" style={{ marginTop: 2 }}>
                  反应中
                </div>
              </div>
            </div>
            <div
              className="panel"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <div
                className="panel-middle"
                style={{ marginTop: 20, cursor: 'pointer' }}
                onClick={() => {
                  // @ts-ignore
                  window.open(window._TASK_EDITOR, '_blank');
                }}
              >
                <img
                  src="/static/images/shiguan-1.png"
                  width={46}
                  height={50}
                  alt=""
                />
                <div className="panel-title" style={{ marginTop: 10 }}>
                  任务编辑
                </div>
              </div>
            </div>
            <div className="panel" style={{ flex: 2 }}>
              <div className="panel-title">设备监控</div>
              <div className="video-wrap">
                <video
                  src="/static/media/monitor.mp4"
                  style={{ height: '100%', objectFit: 'contain' }}
                  autoPlay
                  muted
                  loop
                />
              </div>
            </div>
          </div>
          <div className="main-right-main">
            <div
              className="panel"
              style={{ flex: 1, height: 'calc(100% - 30px)', width: 0 }}
            >
              <div className="panel-title">仪器状态（泵）</div>
              <div className="panel-table">
                <div className="panel-table-column">
                  <div className="bt br"></div>
                  <div className="br">pump_column</div>
                  <div className="br">pump_ext</div>
                  <div className="br">pump_reagents</div>
                  <div className="br">pump_workup</div>
                </div>
                <div className="panel-table-column">
                  <div className="bt">max_velocity</div>
                  <div className="value">
                    {pumps?.pump_column?.max_velocity}
                  </div>
                  <div className="value">{pumps?.pump_ext?.max_velocity}</div>
                  <div className="value">
                    {pumps?.pump_reagents?.max_velocity}
                  </div>
                  <div className="value">
                    {pumps?.pump_workup?.max_velocity}
                  </div>
                </div>
                <div className="panel-table-column">
                  <div className="bt">position</div>
                  <div className="value">{pumps?.pump_column?.position}</div>
                  <div className="value">{pumps?.pump_ext?.position}</div>
                  <div className="value">{pumps?.pump_reagents?.position}</div>
                  <div className="value">{pumps?.pump_workup?.position}</div>
                </div>
                <div className="panel-table-column">
                  <div className="bt">status</div>
                  <div className="value">{pumps?.pump_column?.status}</div>
                  <div className="value">{pumps?.pump_ext?.status}</div>
                  <div className="value">{pumps?.pump_reagents?.status}</div>
                  <div className="value">{pumps?.pump_workup?.status}</div>
                </div>
              </div>
            </div>
            <div className="main-right-main-right">
              <div className="panel" style={{ flex: 1 }}>
                <div className="panel-title">仪器状态（旋蒸仪）</div>
                <div className="panel-table">
                  <div className="panel-table-column">
                    <div className="bt br"></div>
                    <div className="br">rotavap_controller</div>
                  </div>
                  <div className="panel-table-column">
                    <div className="bt">pump_item</div>
                    <div className="value">{rotavap?.pump_time}</div>
                  </div>
                  <div className="panel-table-column">
                    <div className="bt">rotate_time</div>
                    <div className="value">{rotavap?.rotate_time}</div>
                  </div>
                </div>
              </div>
              <div className="panel" style={{ flex: 1 }}>
                <div className="panel-title">仪器状态（萃取仪）</div>
                <div className="panel-table">
                  <div className="panel-table-column">
                    <div className="bt br"></div>
                    <div className="br">separator_controller</div>
                  </div>
                  <div className="panel-table-column">
                    <div className="bt">sensordata</div>
                    <div className="value">{separator?.sensordata}</div>
                  </div>
                  <div className="panel-table-column">
                    <div className="bt">stage</div>
                    <div className="value">{separator?.status}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <img
          src="/static/images/logo-footer.png"
          width={203}
          height={35}
          alt=""
        />
        <img src="/static/images/logo-dp.png" width={229} height={29} alt="" />
      </div>
    </div>
  );
}

export default App;
