/**
 * Created by isaac on 16/3/8.
 */
import request from 'request';

const data = [
  {
    module: '抗凝药物',
    children: [
      {
        module: '抗血小板药物',
        leaf: true
      }, {
        module: '其它活血药物',
        leaf: true
      }]
  },
  {
    module: 'CKD-MBD用药',
    children: [{
      module: '钙剂',
      leaf: true
    }, {
      module: '磷结合剂',
      leaf: true
    }, {
      module: '活性维生素D/类似物',
      leaf: true
    }, {
      module: '拟钙剂',
      leaf: true
    }]
  },
  {
    module: 'CKD其它用药',
    children: [{
      module: '补充制剂',
      leaf: true
    }, {
      module: '免疫抑制剂',
      leaf: true
    }]
  },
  {
    module: '激素',
    leaf: true
  }, {
    module: '中成药',
    leaf: true
  },
  {
    module: '促红素',
    leaf: true
  }, {
    module: '贫血相关药物',
    leaf: true,
    children:
      [
        {
          module: '促红素1',
          leaf: true
        },
        {
          module: '铁剂',
          leaf: true
        },
        {
          module: '其它',
          leaf: true
        }
    ]
  },
  {
    module: '抗生素',
    children:
      [
        {
          module: '头孢类',
          leaf: true
        },
        {
          module: '青霉素类',
          leaf: true
        },
        {
          module: '碳青酶烯类',
          leaf: true
        },
        {
          module: '糖肽类',
          leaf: true
        },
        {
          module: '抗真菌类',
          leaf: true
        },
        {
          module: '氨基糖苷',
          leaf: true
        },
        {
          module: '奎诺酮',
          leaf: true
        },
      ]
  },
  {
    module: '透析器',
    leaf: true
  }, {
    module: '调脂类',
    children:
      [
        {
          module: '他汀类',
          leaf: true
        },
        {
          module: '贝特类',
          leaf: true
        },
        {
          module: '中成药',
          leaf: true
        },
        {
          module: '其它',
          leaf: true
        }
    ]
  },
  {
    module: '其它',
    children: [
      {
        module: 'PPI',
        leaf: true
      }
    ]
  }];

export default function init(baseURL) {
  const url = baseURL + '/drugtype/create';
  const user = '56d146b7fcd3a25aecb4d2c6';
  data.forEach((info) => {
    const {children} = info;
    if (children && children.length > 0) {
      request({
        url: url,
        method: 'POST',
        json: true,
        body: {
          name: info.module,
          creator: user
        }
      }, (error, response, body) => {
        console.log(error, response.statusCode, body);
        children.forEach((child) => {
          request({
            url: url,
            method: 'POST',
            json: true,
            body: {
              name: child.module,
              creator: user,
              super_type: body.data._id
            }
          }, (suberror, subresponse, subbody) => {
            console.log(suberror, subbody, child.module);
          });
        });
      });
    } else {
      request({
        url: url,
        method: 'POST',
        json: true,
        body: {
          name: info.module,
          creator: user
        }
      }, (error, response, body) => {
        console.log(error, response.statusCode, body);
      });
    }
  });
}
