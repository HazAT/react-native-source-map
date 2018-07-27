# How to reproduce

Install all dependencies:

```
yarn
```

To get the error you see below:  
click on `Welcome to React Native!` you will get the inlined function call.  
click on `To get started, edit App.js` you will get "normal" function call.

On Android this produces (only first frame line:col is important):
```
react-native run-android --variant=release
```

<p>
<img width="200" src="https://github.com/hazat/react-native-source-map/raw/master/inline-android.png" alt="inline">
<img width="200" src="https://github.com/hazat/react-native-source-map/raw/master/function-android.png" alt="Function">
</p>

<hr/>

On iOS (only first frame line:col is important):
```
react-native run-ios --configuration "Release"
```

<p>
<img  width="200" src="https://github.com/hazat/react-native-source-map/raw/master/inline-ios.png" alt="inline">
<img  width="200" src="https://github.com/hazat/react-native-source-map/raw/master/function-ios.png" alt="Function">
</p>

<hr/>

We need `line` & `col` to feed into symbolic tests.

To generate the source maps for symbolic, run:

On Android:
```
react-native bundle \
--platform android \
--dev false \
--entry-file index.js \
--bundle-output android-release.bundle \
--sourcemap-output android-release.bundle.map
```

On iOS:

On Android:
```
react-native bundle \
--platform ios \
--dev false \
--entry-file index.js \
--bundle-output ios-release.bundle \
--sourcemap-output ios-release.bundle.map
```

How to run the tests in symbolic:

```
git clone --depth 1 -b feature/react-native-tests https://github.com/getsentry/symbolic.git
```

Here are the tests: https://github.com/getsentry/symbolic/pull/78/files#diff-55ed52f2de2342e85ec60818eb47e7ccR136

If you want to copy new source maps to test in symbolic, copy them to `py/tests/res/sourcemaps/`.  
We only need the sourcemaps since the source code is inlined there.

To run the tests in symbolic:
Required:
- `python`
- `pytest` `pip install pytest`

Easy way:
- `pip install symbolic`
- Continue to run tests

```
cd symbolic/py
pytest -vv tests/test_sourcemaps.py
```

You should get an output that looks like this:

```
===================================================== test session starts =====================================================
platform linux2 -- Python 2.7.15rc1, pytest-3.6.3, py-1.5.4, pluggy-0.6.0 -- /usr/bin/python
cachedir: .pytest_cache
rootdir: /symbolic/py, inifile:
collected 9 items

tests/test_sourcemaps.py::test_basics PASSED                                                                            [ 11%]
tests/test_sourcemaps.py::test_load_index PASSED                                                                        [ 22%]
tests/test_sourcemaps.py::test_jquery PASSED                                                                            [ 33%]
tests/test_sourcemaps.py::test_coolstuff PASSED                                                                         [ 44%]
tests/test_sourcemaps.py::test_unicode_names PASSED                                                                     [ 55%]
tests/test_sourcemaps.py::test_react_dom PASSED                                                                         [ 66%]
tests/test_sourcemaps.py::test_source_access PASSED                                                                     [ 77%]
tests/test_sourcemaps.py::test_wrong_rn_sourcemaps_android FAILED                                                       [ 88%]
tests/test_sourcemaps.py::test_wrong_rn_sourcemaps_ios PASSED                                                           [100%]

========================================================== FAILURES ===========================================================
______________________________________________ test_wrong_rn_sourcemaps_android _______________________________________________

get_sourceview = <function getter at 0x7f3cb5a0ff50>, get_sourcemapview = <function getter at 0x7f3cb5a0fc08>

    def test_wrong_rn_sourcemaps_android(get_sourceview, get_sourcemapview):
        index = get_sourcemapview('android-release.bundle.map')
        inline = index.lookup(308, 1116)
        # To print found token
        # import pprint; pprint.pprint(inline.__dict__)
        _failHere = index.lookup(308, 924)
        # To print found token
        # import pprint; pprint.pprint(inline.__dict__)

        # To print source code of file
        # print(str(index.get_sourceview(308).get_source()))
>       assert inline.name == 'invalidFunction'
E       AssertionError: assert None == 'invalidFunction'
E        +  where None = <SourceMapTokenMatch /Users/haza/Projects/demo-projects/SMTest/App.js:48>.name

tests/test_sourcemaps.py:147: AssertionError
============================================= 1 failed, 8 passed in 0.29 seconds ==============================================
```

This shows that the source map test for Android is failing.  
Both source code location on iOS and Android should be the same (even though the reported crash location can be different).
