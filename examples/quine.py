import inspect
quine = lambda x: print('import inspect\n' + x + 'quine(inspect.getsource(quine))');
quine(inspect.getsource(quine))
