import { BASE_URL, MEDIA_URL } from '@/config';
import '@/styles/vditor.css';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Vditor from 'vditor';
// import 'vditor/dist/index.css';
import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
interface VditorMarkdownProps {
  onChange?: (value: string) => void;
  TYPE: 'create' | 'edit';
  initialContent: string;
  documentUUID: string;
}

const VditorMarkdown: React.FC<VditorMarkdownProps> = ({
  onChange = () => {},
  initialContent,
  documentUUID,
}) => {
  const jwtAxios = createAxiosWithInterceptors();
  let { resolvedTheme, setTheme } = useTheme();
  const [vd, setVd] = useState<Vditor>();

  useEffect(() => {
    if (!vd) {
      const vditor = new Vditor('vditor', {
        theme: resolvedTheme === 'dark' ? 'dark' : 'classic',
        placeholder: 'Start Writing...',
        lang: 'en_US',
        cache: {
          enable: false,
        },

        toolbar: [
          'emoji',
          'headings',
          'bold',
          'italic',
          'strike',
          'link',
          '|',
          'list',
          'ordered-list',
          'outdent',
          'indent',
          '|',
          {
            name: 'quote',
            tip: 'quote',
            icon: '<svg t="1708927859303" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6657" width="200" height="200"><path d="M48 592h272v-80H128V272h256v304c0 121.712-48 176-176 176v80c160 0 256-90.928 256-256V192H48v400z m512-400v400h272v-80H640V272h256v304c0 121.712-48 176-176 176v80c160 0 256-90.928 256-256V192H560z" fill="#565D64" p-id="6658"></path></svg>',
          },
          'line',
          'code',
          'inline-code',
          '|',
          {
            name: 'upload',
            tip: 'image',
            icon: '<svg t="1701327441695" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5184" width="200" height="200"><path fill="#9195a1" d="M896 160c17.6 0 32 14.4 32 32v639.6l-10-13-272-352c-9-11.8-23.2-18.6-38-18.6s-28.8 6.8-38 18.6l-166 214.8-61-85.4c-9-12.6-23.4-20-39-20s-30 7.4-39 20.2l-160 224-9 12.4V192c0-17.6 14.4-32 32-32h768zM128 64C57.4 64 0 121.4 0 192v640c0 70.6 57.4 128 128 128h768c70.6 0 128-57.4 128-128V192c0-70.6-57.4-128-128-128H128z m160 384a96 96 0 1 0 0-192 96 96 0 1 0 0 192z" p-id="5185"></path></svg>',
          },
          'table',
          '|',
          'undo',
          'redo',
          '|',
          // 'fullscreen',
          'edit-mode',
          {
            name: 'more',
            toolbar: [
              // "both",
              // "code-theme",
              // "content-theme",
              'export',
              'outline',
              // "preview",
              // "devtools",
              // "info",
              // "help"
            ],
          },
        ],

        after: () => {
          // after 方法获取到初始化完成的 vditor ，为其添加值。
          vditor.setValue(initialContent !== null ? initialContent : '');
          setVd(vditor);
          // 添加动画类
          const vditorElement = document.querySelector('.vditor');
          if (vditorElement) {
            vditorElement.classList.add('float-in');
          }
        },

        input: (value) => {
          //
          onChange(value);
        },
        upload: {
          accept: 'image/*',
          multiple: false,
          max: 1024 * 1024 * 10,

          handler: (files) => {
            return new Promise<string>((resolve, reject) => {
              const [file] = files;

              const formData = new FormData();
              formData.append('image', file);
              jwtAxios
                .post(
                  `${BASE_URL}/document/vs/attachment/?uuid=${documentUUID}`,
                  formData,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                  },
                )
                .then((res) => {
                  if (res.data) {
                    const { id, image, size } = res.data;

                    const uploadUrl = `${MEDIA_URL}${image}`;

                    // axios.put(url, file, {
                    //     withCredentials: true,
                    //     headers: {
                    //         'Content-Type': '',
                    //     },

                    // })
                    // .then(() => {
                    let succFileText = '';
                    if (vditor && vditor.vditor.currentMode === 'wysiwyg') {
                      succFileText += `\n <img alt="" src="${uploadUrl}">`;
                    } else {
                      succFileText += `  \n![](${uploadUrl})`;
                    }
                    vditor.insertValue(succFileText);
                    resolve(uploadUrl);
                    // })
                    // .catch(() => {
                    //     reject(new Error('上传失败'));
                    // });
                  } else {
                    reject(new Error('上传失败'));
                  }
                })
                .catch(() => {
                  reject(new Error('上传失败'));
                });
            });
          },
        },
      });
      setVd(vditor);
    } else {
      vd.setTheme(resolvedTheme === 'dark' ? 'dark' : 'classic');
    }
    // 不能清除，否则会导致主题切换时，vditor 重新初始化，里面的内容会丢失。
    // return () => {
    //   vd?.destroy();
    //   setVd(undefined);
    // };
  }, [resolvedTheme]);

  return <div id="vditor" className="vditor my-4" />;
};

export default VditorMarkdown;
