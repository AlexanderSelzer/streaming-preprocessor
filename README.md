Preprocessing CSS with streams
==========

This is a experiment investigating the best ways to process CSS.

Right now, it supports CSS variables, and multiline/single comments.
It can produce compact output.

It works quite well and is organized.

### So, why?

Normally a lexer and parser are used to convert languages to a syntax tree and
process them.
This is a different approach, using a stream of lines, and a shared hash object.

### Example

```bash
$ node index.js eg.css -v --remove-comments --compare

Input size: 826
Output size: 460
```

```CSS
Input:
::root {
  var-hello: red;
  var-this-that: #000;
  var-and-that: rgb(0, 3, 7);
}

li a,
.hello li a {
  padding-left: 20px; /* */
  background: var(and-that);
}

.header {
  // margin: 4px 0 0;
  padding: 0;
  background-color: var(this-that);
  clear: none; //both;
}

.body {
  height: /* 800px*/ 720px;
  border: 1px solid;
  color: /* var(hello)*/ var(this-that);
  border-color: var(hello);
  border-color: /*rgba(255, 255, 255, 0.5)*/ #382948;
  background: #eee;
  background: rgba(255, 255, 255, 0.7);
  margin: 4px 0;
  padding: 3px 8px;
}

/*
li {
  box-shadow: 0 0 4 6 #939283;
  padding-left: 34px;
  margin-top: 12px;
}
*/

li {
  box-shadow: 3 2 6 8 #392132;
  padding-left: 16px;
  
  margin-top: 10px; /* 12px;
  color: rgb(0, 28, 12);
  */
  
  /* min-width:  20px;
  max-width: 32px; */ min-height: 32px;
}
```
Output:

```CSS
::root {
}
li a,
.hello li a {
  padding-left: 20px; 
  background: rgb(0, 3, 7);
}
.header {
  padding: 0;
  background-color: #000;
  clear: none; 
}
.body {
  height:  720px;
  border: 1px solid;
  color:  #000;
  border-color: red;
  border-color:  #382948;
  background: #eee;
  background: rgba(255, 255, 255, 0.7);
  margin: 4px 0;
  padding: 3px 8px;
}
li {
  box-shadow: 3 2 6 8 #392132;
  padding-left: 16px;
  margin-top: 10px; 
 min-height: 32px;
}
```

```bash
$ node index.js eg.css -v --remove-comments --compact
Input size: 826
Output size: 355


li a,.hello li a{padding-left:20px;background:rgb(0,3,7);}.header{padding:0;background-color:#000;clear:none;}.body{height:720px;border:1px solid;color:#000;border-color:red;border-color:#382948;background:#eee;background:rgba(255,255,255,0.7);margin:4px 0;padding:3px 8px;}li{box-shadow:3 2 6 8 #392132;padding-left:16px;margin-top:10px;min-height:32px;}

```