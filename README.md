# how to write a quine

* [intro](#intro)
* [techniques](#techniques)
    * [syntax introspection](#syntax-introspection)
    * [string encoding](#string-encoding)
    * [bytes](#bytes)
    * [error](#error)
    * [language quirks](#quirks)
* [additional fun](#additional-fun)

## intro

A `quine` is a program that prints its own source. It's one of the first programs I'll try and write when learning a new language, but it wasn't always obvious to me how. At first these cute programs seemed like an almost impossible esoteric [IOCCC](https://www.ioccc.org/)-tier artform crafted by programming artisans.

I want to share the general concepts used to construct programs like these, and explore some of the things that can be done with them.

## techniques

Non-trivial quines nearly always use some form of conversion between code and data, the most straightforward of which appear in languages that give access to string representations of the code. 

#### syntax introspection

A quine in a simple language with a `getSource` function may look like

```
expr = print('expr = ' . getSource(expr))
```

We can access most of the source code already with this function by referencing `expr`, but notice how we had to specify `'expr = '` again, because it falls outside the expression the source is coming from.

This string data is actually used twice in the output string! Once at the start of the output, and again as part of the source of the expression. This dual-use of information is a common theme when writing quines.

JavaScript allows this kind of introspection for arbitrary functions by just converting them to strings:

```javascript
function quine() {
    console.log(quine.toString() + '\nquine();');
}
quine();
```

This is very similar to our pseudocode example, except we use a function rather than a generic expression.

Now for the same example in python:

```python
import inspect
quine = lambda x: print('import inspect\n' + x + 'quine(inspect.getsource(quine))');
quine(inspect.getsource(quine))
```

Unfortunately a lot more boilerplate is required to glimpse behind the curtain and grab the code, but it uses the exact same approach at the previous examples.

We'll find a shorter Python quine later.



While these quines are easy to make and understand, the functionality to achieve them isn't common to most programming languages. When it's absent, we have to do something else.

#### string encoding

```
//q=`%3Bconsole.log(%60q%3D%5C%60%24%7Bq%7D%5C%60%60%2BdecodeURIComponent(q))`;console.log(`q=\`${q}\``+decodeURIComponent(q))
```

## additional fun

If we look at the simple javacript quine from before

```javascript
function quine() {
    console.log(quine.toString() + '\nquine();');
}
quine();
```

Or more succinctly 

```javascript
(q=_=>console.log(`(q=${q})()`))()
```

It's possible to modify any reflected section and still remain a quine

```javascript
(q=_=>/* this is still a quine */console.log(`(q=${q})()`))()
```


// get aditsu to proofread

types
    reflect 
        expression introspection
            getSource example
            js example can be trivial
        string 
            data
            eval
                example from .rs
        bytes
            data
                C
                vlang
                ascii too
                8080 assembly version


    language quirks
    self modifying
        befunge
    error 
        honourable mention
        stupid example of copying until it matches

    additional fun
        js example from before
        extra space for extra things - syntax highlighting
        palindromic quine
        ascii art square
        with bytes
        html src=#
        shorter python quine

        other references


        examples
        https://rosettacode.org/wiki/Quine

        asem1k world -> one of the first, describe how it works
        relay -> author wrote a book explaining it in detail, if you can read japanese

    storing data vs reflection

    eval() example
    json_encode
    encodeURIComponent
(x=>(a=x+unescape('%60'))+a)`(x=>(a=x+unescape('%60'))+a)`

    LISP
    perl

palidromic quine
(q=u=>(i=`(q=${q},q())`,i+' // '+[...i].reverse().join``),q()) // ))(q,)``nioj.)(esrever.]i...[+' // '+i,`))(q,}q{$=q(`=i(>=u=q(

ambigram quine
square

    q=";throw`q=%22${q}%22`+unescape(q)";throw`q="pl a${q}"`+unescape(q)
    (q=_=>{throw`(q=${q})()`})()
    (x=>(a=x+unescape('%60'))+a)`(x=>(a=x+unescape('%60'))+a)`
        cute cjam version 
    https://www.perlmonks.com/?node_id=835076
    https://www.perlmonks.com/?node_id=765005
