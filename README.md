## 页面生成脚手架

```bash
# create evaluationPackage page
# 注意： 字段id必须存在
# id name status:(自定义)生成字段 string:字段类型 select:生成暂时(input/select/textArea)3种
node scaffold create "evaluationPackage id:number:input name:string:input status:string:select"

# destroy evaluationPackage page
node scaffold destroy "evaluationPackage"

```
