import { fromEvent, map } from "rxjs";



export class LinkedList<T>{

  constructor(startVal:any){
      this._head.val = startVal;
      (this.list ) = this._head
  }

  addNode= (val)=>{
      (this.list ).next = {
          val,
          next:null
      }
      this.list =  (this.list ).next
  }

  getHead= ()=>{
      return this._head
  }

  closeList = ()=>{
    this.list.next= this.getHead()
  }



  _head:{
    val:T ,
    next:any
  }= {
      val:null as any,
      next:null as any
  }

  list= null
}

export let updateClassString=(obj:any,myClassDefault:string,classListDefault:string)=>{

    return (val:string,type:"add"|"remove"="add")=>{
        let myClass=myClassDefault
        let classList=classListDefault
        if(type === "add"){
          if(!obj[classList].includes(val)){

            obj[classList].push(val)
          }
        }
        else if(type === "remove"){
          obj[classList] = (obj[classList])
          .filter((myClass)=>{
            return myClass !== val
          })
        }
        obj[myClass] = obj[classList]
        .reduce((acc,x,i)=>{
          return acc+ " " +  x
        },"")
      }
  }

export let readFileContent = (
  file: File,
  readPredicate:"readAsBinaryString" |"readAsArrayBuffer" | "readAsDataURL" | "readAsText" ="readAsBinaryString" )=> {
    let reader = new FileReader();
    reader[readPredicate](file)

    return fromEvent(reader as any,"load")
    .pipe(
      map(()=>{

        let content = reader.result.toString()

        return {content,file}
      })
    )

  }


export let  transformFromCamelCaseToSnakeCase = str => str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
export let  transformFromSnakeCaseToCamelCase = (str)=>{
    return   str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('_', '')
    )
  }

export let retriveValueFromPXUnit = (str: string) => {
  return str.match(/\d+/)[0]
}
