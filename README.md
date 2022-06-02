# how to write a quine

* [intro](#intro)
* [techniques](#techniques)
    * [syntax access](#syntax-access)
    * [string encoding](#string-encoding)
        * [more string encoding](#more-string-encoding)
    * [bytes](#bytes)
    * [eval](#eval)
    * [error](#error)
    * [language quirks](#quirks)
* [additional fun](#additional-fun)

## intro

A `quine` is a program that provides its own source code as output. It's one of the first programs I'll try and write when learning a new language, but it wasn't always obvious to me how. At first these cute programs seemed like an almost impossible esoteric [IOCCC](https://www.ioccc.org/)-tier artform crafted by programming artisans.

I want to share the general concepts used to construct programs like these, and explore some of the things that can be done with them.

## techniques

Non-trivial[*](#cheating) quines nearly always use some form of transform between code and data, the most straightforward of which appear in languages that give access to string representations of the code. 

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

But this isn't enough; we need to add quotes the first time we print the data, otherwise we get this output:

```
data = ; print('data = ' . data . data); print('data = ' . data . data)
```

Adding the quotes into the data string would require escaping them. 

This can be done, but alternatively we could call a function to add the quotes without using the quote characters themselves.

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

But we aren't tied to quoting functions. We can use all sorts of transforms to represent data differently;

```javascript
data = "; console.log('data = \"' + data + '\"' + data)"; console.log('data = "' + data + '"' + data)
```

In this non-working example, we moved the quotes into the main printed string instead. This avoids having to quote the string, but the quotes cannot be embedded in the data string without being escaped, which will not show in the final output.

If we replace the quotes with something else, we can later transform them back into quotes:

```javascript
data = "; console.log('data = %22' + data + '%22' + unescape(data))"; console.log('data = "' + data + '"' + unescape(data))
```

So the first time the data is printed, the quotes show normally as `%22`, then next when they are unescaped they show correctly as `"`!

#### more string encoding

We can also just encode the whole string. PHP has some built in base64 stuff we can use;

```php
<?php $data = ""; echo '<?php $data = "'.$data.'"' .base64_decode($data);
```

First we create our template with missing data as before, then we need to generate a base64 representation of our code;

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
data = "#<!qsjou!(ebub!>!#(!,!ebub!,!ebub/dibst/nbq|}di})di/pse.2*/dis~/kpjo)*"; print 'data = "' + data + data.chars.map{|ch|(ch.ord-1).chr}.join()
```

Of course, you're not limited to just ASCII characters.

```javascript
data = "󘬊󨽯󫭳󫽬󩜮󫍯󩼨󙽤󨝴󨜠󟜠󘬧󘌫󘍤󨝴󨜠󚼠󭝮󩝳󨽡󬍥󚍥󬽣󨝰󩜨󩍡󭍡󚜮󬭥󬍬󨝣󩜨󛽵󛬮󛽧󛌧󘌧󚜩󚜻"
console.log('data = "' + data + unescape(escape(data).replace(/u../g,'')))
```

<sub>(You may have noticed the structure change to `data = ""; print('data = "' . data  . convert(data))` in the last few examples, as one of the quotes can be embedded in the data)</sub>


### bytes

Most of the examples so far have leaned on high level string methods, but the data can really be anything as long as there's a way to output it.

Take this C quine;

```C
#include <stdio.h>

int data[] = {125,59,10,10,105,110,116,32,109,97,105,110,40,41,32,123,10,32,32,112,114,105,110,116,102,40,34,35,105,110,99,108,117,100,101,32,60,115,116,100,105,111,46,104,62,92,110,92,110,105,110,116,32,100,97,116,97,91,93,32,61,32,123,34,41,59,10,32,32,10,32,32,102,111,114,32,40,105,110,116,32,105,32,61,32,48,59,32,100,97,116,97,91,105,93,59,41,32,123,10,32,32,32,32,112,114,105,110,116,102,40,34,37,100,34,44,32,100,97,116,97,91,105,93,41,59,10,32,32,32,32,105,102,32,40,100,97,116,97,91,43,43,105,93,41,32,112,114,105,110,116,102,40,34,44,34,41,59,10,32,32,125,10,10,32,32,102,111,114,32,40,105,110,116,32,105,32,61,32,48,59,32,100,97,116,97,91,105,93,59,41,32,123,10,32,32,32,32,112,114,105,110,116,102,40,34,37,99,34,44,32,100,97,116,97,91,105,43,43,93,41,59,10,32,32,125,10,125};

int main() {
  printf("#include <stdio.h>\n\nint data[] = {");
  
  for (int i = 0; data[i];) {
    printf("%d", data[i]);
    if (data[++i]) printf(",");
  }

  for (int i = 0; data[i];) {
    printf("%c", data[i++]);
  }
}
```

If you squint you may be able to see that this is very similar to our string-based examples, except we're using bytes to represent character codes. We are still printing the data in two ways; to represent the collection of bytes, and to represent the code itself.

This is about as simple as we can get; just some bytes, loops, and printing. It should start to become clear how this idea can be applied to any language.

Using bytes was how I managed to eventually squeeze a quine out of vlang:

```vlang
m:=[32, 112, 114, 105, 110, 116, 40, 39, 109, 58, 61, 39, 43, 109, 46, 115, 116, 114, 40, 41, 41, 102, 111, 114, 32, 98, 32, 105, 110, 32, 109, 123, 112, 114, 105, 110, 116, 40, 115, 116, 114, 105, 110, 103, 40, 91, 98, 93, 41, 41, 125] 
print('m:='+m.str())for b in m{print(string([b]))}
```

<sub>(In C, you could imagine using char[] instead of int[] for the data and printing the string all at once without looping. In vlang, `string` seems to truncate to 1 character, even though it takes an array (!?), so you end up with this weird `string([b])` loop thing)</sub>


---

A good example of this approach is [this quine in 8080 Assembly](https://rosettacode.org/wiki/Quine#8080_Assembly). If you look at the data at `P` label you can see the bytes are a representation of the instructions above it.

### eval

Languages with eval can do a sneaky trick. Since data passed to eval will be a string, we already have a reference to a printable version of the code that is run and can skip having to do any introspection on it. 

```
data = "print('data = ' . addQuotes(data) . '; eval(' . data . ')')"; eval(data)
```

The data is now being passed to eval as code, and when that code executes it references the data again to print it in the output.

This style of quine tends be shorter or have less repetition, as it leans on eval to do most of the work.

In Ruby

```ruby
data="print('data='+data.dump+';eval(data)')";eval(data)
```

In Python

```python
data="print('data='+repr(data)+';eval(data)')";eval(data)
```

Lua has a `load` function that creates a function from a string that can be used in a similar way.

```lua
data="print(string.format('data=%q load(data)()',data))" load(data)()
```

In the Lua example, we use `%q` to provide a quoted version of the data to the string formatter.

### error

There's a kind of cheeky quine that abuses interpreter errors or warnings.

If I put this into 

something

js

FreeDOS

### language quirks

So far we've declared our data as a top level variable, but we could just as easily use a function or lambda expression that we immediately invoke.

Lets play with JavaScript again;

```javascript
(data => data + '(' + data + ')')("")
```

Here's our template. If we add the appropriate data as the function params and use the trick to quote the strings we get a similar quine to before;

```javascript
(data => data + '(' + JSON.stringify(data) + ')')("(data => data + '(' + JSON.stringify(data) + ')')")
```

We can clean this up by calling our function as a [tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) to remove needing the brackets.

```javascript
(data => data + unescape('%60') + data + unescape('%60'))``
```

Here's our new template. We had to add `unescape('%60')` for the backticks.

An interesting pattern reveals itself. The second half of the output is the same as the first, but repeated, so we can simplify our template a lot;

```javascript
(d => (d = d + unescape('%60')) + d)``
```

Because the very essence of quines is that the output matches the source, this means that the source code will be a single string repeated twice too!

We end up with this beautiful repeating quine;

```javascript
(d => (d = d + unescape('%60')) + d)`(d => (d = d + unescape('%60')) + d)`
```

This same quine in the esolang [CJam](https://sourceforge.net/projects/cjam/) is;

```cjam
"`_~"`_~
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
                ascii too


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
        html src=# polyglot PNG
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

eval([void null] + new function() {})
void

IOCCC empty file

The data doesnt even have to be bytes, it can be anything.

capjs compression

https://cs.lmu.edu/~ray/notes/quineprograms/

    LISP
    perl

palidromic quine
(q=u=>(i=`(q=${q},q())`,i+' // '+[...i].reverse().join``),q()) // ))(q,)``nioj.)(esrever.]i...[+' // '+i,`))(q,}q{$=q(`=i(>=u=q(

ambigram quine
oruborus quine
square

    https://www.perlmonks.com/?node_id=835076
    https://www.perlmonks.com/?node_id=765005

    IOCCC quine

---
##### cheating

blah blah cheating quines
some quines on this page could be considered 'cheating'
rust include_str!()
1
