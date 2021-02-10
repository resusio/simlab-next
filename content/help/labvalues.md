---
title: 'Manipulating Lab Values'
author: 'Tristan Jones'
order: 20
---

# Manipulating Lab Values

Note that some lab results are generated as random, normally-distributed values, while others are _derived_ from a combination of other lab values. _Derived_ values are indicated with a ![](images/help/derived.png) icon. Lab results lacking that icon are normally-distributed.

#### Locking a Lab Value

By clicking on the lock icon ![](images/help/unlocked.png) at the right edge of a lab result row, the result will be locked to it's current value. This is indicated by the icon changing to the locked appearance: ![](images/help/locked.png). Neither the **Generate New Report** button, nor updating a parent lab result will change the value of a locked result row. Note that the value of the result row can still be changed manually.

#### Modifying a Lab Result Manually

Any lab result row can have a value entered manually in order to override the automatically generated result.

1. Click on the lab result _value_ (the number). It will open and allow text to be selected and changed: ![](images/help/hgb-open-unlocked.png)
2. Enter a new value for the lab result.
3. If the entered value is invalid, the result value will be highlighted in red and it will not be submitted ![](images/help/invalid-value.png)
4. If the new value is valid, the result can be saved by either pressing **<Enter>**, or by clicking anywhere on the screen outside of the result row.
5. Entry of a new value can be cancelled at any time by pressing **<Escape>**.

##### Modifying a Parent Lab Report Value

If a lab result is the parent of a _derived_ lab result (e.g. a _derived_ lab depends on its value), then modifying the parent result will automatically update the derived value, _unless it is locked_.

##### Modify a Derived Lab Report Value

Derived lab results can be manually edited in the same manner as any other lab result: by clicking on the value and entering a new value. **At the current time, this will NOT update the parent lab result**. This is a future feature that will be implemented.
