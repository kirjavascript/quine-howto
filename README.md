# how to write a quine

* [intro](#intro)
* [techniques](#techniques)
    * [syntax access](#syntax-access)
    * [string encoding](#string-encoding)
        * [even more string encoding](#even-more-string-encoding)
    * [eval](#eval)
    * [bytes](#bytes)
    * [error](#error)
    * [language quirks](#quirks)
* [additional fun](#additional-fun)

## intro

A `quine` is a program that provides its own source code as output. It's one of the first programs I'll try and write when learning a new language, but it wasn't always obvious to me how. At first these cute programs seemed like an almost impossible esoteric [IOCCC](https://www.ioccc.org/)-tier artform crafted by programming artisans.

I want to share the general concepts used to construct programs like these, and explore some of the things that can be done with them.

## techniques

Non-trivial quines nearly always use some form of transform between code and data, the most straightforward of which appear in languages that give access to string representations of the code. 

### syntax access

A quine in a simple language with a `getSource` function may look like

```
expr = print('expr = ' . getSource(expr))
```

We can access most of the source code already with this function by reading `expr`. However, we have to specify `'expr = '` again, because it falls outside the expression the source is coming from.

This string data is actually used twice in the output string! Once at the start of the output, and again as part of the source of the expression. This reuse of information is a common trick when writing quines.

JavaScript allows this kind of introspection for arbitrary functions by just converting them to strings:

```javascript
function quine() {
    console.log(String(quine) + '\nquine();');
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

More boilerplate is required to glimpse behind the curtain and grab the code, but it uses the exact same approach at the previous examples.

We'll find a shorter Python quine later.

While these quines are easy to make and understand, the functionality to achieve them isn't common to most programming languages. When it's absent, we have to do something else.

### string encoding

A more general approach we can use is to have some blob of data, and use it in the output twice; once to represent itself, and again to represent the rest of the code. 

This is best demonstrated with strings.

```
data = ""; print('data = ' . data  . data)
```

Here is a template with no data. We print `data = `, the data itself, then the data again.

All we have to do is make the data contain everything that comes after it.

```
data = "; print('data = ' . data . data)"; print('data = ' . data . data)
```

Unfortunately the first time the data appears in our output the quotes are missing;

```
data = ; print('data = ' . data . data); print('data = ' . data . data)
```

To fix this, we can just call a function to manually add the quotes

```
data = "; print('data = ' . addQuotes(data) . data)"; print('data = ' . addQuotes(data) . data)
```

This transform allows us to print the string in two different ways, as data and as code. And we have our quine!

Ruby provides a sort of debug view for a string that gives the same solution:

```ruby
data = "; print('data = ' + data.dump + data)"; print('data = ' + data.dump + data)
```

As does Python:

```python
data = "; print('data = ' + repr(data) + data)"; print('data = ' + repr(data) + data)
```

In JavaScript, we can use `JSON.stringify`

```javascript
data = "; console.log('data = ' + JSON.stringify(data) + data)"; console.log('data = ' + JSON.stringify(data) + data)
```

But we aren't tied to quoting strings. We can use all sorts of transforms to represent data differently;

```javascript
data = "; console.log('data = \"' + data + '\"' + data)"; console.log('data = "' + data + '"' + data)
```

In this non-working example, we moved the quotes into the main printed string instead. This avoids having to quote the string, but the quotes cannot be embedded in the data string without being escaped, which will not show in the final output.

If we replace the quotes with something else, we can later transform them back into quotes:

```javascript
data = "; console.log('data = %22' + data + '%22' + unescape(data))"; console.log('data = "' + data + '"' + unescape(data))
```

So the first time the data is printed, the quotes show normally as `%22`, then next when they are unescaped they show correctly as `"`!
#### even more string encoding

We can also just encode the whole string. PHP has some built in base64 stuff we can use;

```php
<?php $data = ""; echo '<?php $data = "'.$data.'"' .base64_decode($data);
```

First we create our template with missing data as before, then we just need to generate a base64 representation of our code;

```php
<?php echo base64_encode('; echo \'<?php $data = "\'.$data.\'"\' .base64_decode($data);');
```

We dont have to worry about quote escapes as the base64 representation will not contain any.

```php
<?php $data = "OyBlY2hvICc8P3BocCAkZGF0YSA9ICInLiRkYXRhLiciJyAuYmFzZTY0X2RlY29kZSgkZGF0YSk7"; echo '<?php $data = "'.$data.'"' .base64_decode($data);
```

The two representations of the data are very different to each other. We can use lots of different types of encoding for this. Say, hex digits in Python;

```python
d="3b7072696e742827643d22272b642b62797465732e66726f6d6865782864292e6465636f6465282929";print('d="'+d+bytes.fromhex(d).decode())
```

If a language doesnt have builtins for encoding, we can write our own.

Here's an example in Ruby where we just add 1 to the character code and subtract it when we want to format it;

```ruby
data = "<!(ebub!>!(!,!ebub/evnq!,!ebub/dibst/nbq|}di})di/pse.2*/dis~/kpjo)*"; 'data = ' + data.dump + data.chars.map{|ch|(ch.ord-1).chr}.join()
```

TODO: add print

(x=>(a=x+unescape('%60'))+a)`(x=>(a=x+unescape('%60'))+a)`

It's possible to use this technique without a transform.

beautiful symmetrical pattern - cjam

### bytes



### eval


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

It's possible to modify any reflected segment and still remain a quine

```javascript
(q=_=>/* this is still a quine */console.log(`(q=${q})()`))()
```


// get aditsu to proofread


```javascript
data = "; console.log('data = ' + JSON.stringify(data) + data)"; console.log('data = ' + JSON.stringify(data) + data)
```

types
    reflect 
        expression introspection
            getSource example
            js example can be trivial
        string 
            data
                example from .rs
            eval
                https://towardsdatascience.com/how-to-write-your-first-quine-program-947f2b7e4a6f
        bytes
            data
                ascii, XOR
                C
                squeeze a quine out of vlang
                ascii too
                if you squint at 8080 assembly example


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
        REPL quines

        other references


        examples
        https://rosettacode.org/wiki/Quine
        https://esolangs.org/wiki/User:Hakerh400/How_to_write_quines
        http://www.madore.org/~david/computers/quine.html

        asem1k world -> one of the first, describe how it works
        relay -> author wrote a book explaining it in detail, if you can read japanese

    storing data vs reflection

fn main(){let q=r###"println!(r##"fn main(){{let q=r#{}#;"##,format!(r#"##{}##"#,format!(r#""{}""#,q)));print!("{}",q);}"###;
println!(r##"fn main(){{let q=r#{}#;"##,format!(r#"##{}##"#,format!(r#""{}""#,q)));print!("{}",q);}

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

<!-- "`_~"`_~ -->
        cute cjam version 
    https://www.perlmonks.com/?node_id=835076
    https://www.perlmonks.com/?node_id=765005
