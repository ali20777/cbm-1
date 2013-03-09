# Condition Based Maintenance

Condition Based Maintenance (CBM) is an effective form of predictive maintenance where we monitor usage of equipment and allow predefined rules to recommend when maintenance should be performed.

## Background

Maintenance performed should depend on how our equipment was used. Variables in environmental factors and equipment usage contribute to vastly different wear on equipment. If we want our equipment to always be in an optimal state for the next usage, then we need to track how and where equipment was used so we get an understanding of what maintenance is needed.

As an example, let's consider two environments where oil drilling equipment could be used:

1. Well temperature is measured at 150 degrees C, well pressure is measured at 10,000 PSI, and the tool is used for 1 hour
2. Well temperature is measured at 300 degrees C, well pressure is measured at 30,000 PSI, and the tool is used for 20 hours

In the first example, there is a low temperature, low pressure well and the tool isn't used for very long. If we know the tool is capable of handling that environment, then we wouldn't expect much maintenance to be needed for that tool to return to an optimal condition for the next usage.

In the second example, there is a high temperature, high pressure well and the tool is used for much longer. If we know that this environment is right at the maximum of what the tool was designed to handle, then we know that we should perform more maintenance on the tool - or at least have a more detailed inspection of possible damage - to get confidence that the tool is in optimal condition for the next usage.

Condition based maintenance is about setting up rules to suggest the amount of maintenance that needs to be done on equipment based on the environment and usage. This ultimately allows us to maintain the most reliable and predictable tools while minimizing unnecessary maintenance costs.

## Roadmap

### Version 1.0

* Identify measurements that will be captured during runs and used to create rules
* Define sample runs used to understand how rules will trigger maintenance
* Use sample runs to visualize how rules would recommend maintenance to be performed
* Manage custom maintenance levels triggered at specified points
* Ability to provide a desired level of maintenance to be triggered for a sample run and have the application determine the factors and offsets needed

### Version 2.0

* Create CBM groups to store maintenance rules and see how the rules will trigger maintenance on sample runs
* Ability to save work to continue working later and share work with other team memebers
* Ability to save and resuse sample run and measurement sets for resuse in other CBM groups
* Compare two sets of maintenance rules over one set of sample runs to see how maintenance recommendations differ

### Version 3.0

* Ability to perform unit conversion on measurement values
* Import historial run and maintenance data to visualize when maintenance would have been recommended vs when it was actually performed

## Database Design

### cbm_group
* id
* name
* description

### trigger_set
* id
* name

### trigger
* id
* trigger_set_id
* level
* points

### cbm_group_trigger_set
* cbm_group_id
* trigger_set_id

### measurement_set
* id
* name

### measurement
* id
* name
* units
* factor
* offset
* lower
* upper

### cbm_group_measurement_set
* cbm_group_id
* measurement_set_id

### run_set
* id
* name

### run_measurement
* id
* run_set_id
* measurement_id
* value

### cbm_group_run_set
* cbm_group_id
* run_set_id

## Future Feature: Introduce Math

For each run, user enters desired level of maintenance then use linear algebra to solve equations

### Variables
* let _i_ be the index of measurements used to create rules
* let _n_ be the number of measurements used to create rules
* let _j_ be the index of sample runs used to create rules
* let _g_ be the number of sample runs used to create rules
* let _k_ be the index of maintenance levels
* let _h_ be the number of maintenance levels, where 0 < _h_ <= 5
* let _t_ = [_t_<sub>_1_</sub>, ..., _t_<sub>_j_</sub>] be the point values needed to trigger each maintenance level
* let _m_ = [_m<sub>1</sub>_, ..., _m<sub>n</sub>_] be the set of measurements
* let _f_ = [_f<sub>1</sub>_, ..., _f<sub>n</sub>_] be the set of factors for measurement _i_
* let _o_ = [_o<sub>1</sub>_, ..., _o<sub>n</sub>_] be the set of offsets for measurement _i_
* let _v_ be a _g_ x _n_ matrix of values recorded for measurements on all runs
  * so _v<sub>ji</sub>_ is the value for measurement _i_ during run _j_
* let _l_ = [_l<sub>1</sub>_, ..., _l<sub>g</sub>_] be the desired maintenance level triggered for each run
* let _p_ be a _g_ x _n_ matrix of normalized points for a specific measurement given a specific run value
  * in general, let _p_ = (_f_ * _v_) + _o_
  * points for measurement _i_ of run _j_, _p<sub>ji</sub>_ = (_f<sub>i</sub>_ * _v<sub>ji</sub>_) + _o<sub>i</sub>_
  * so total points for run _j_, _p<sub>j</sub>_ = SUM(_p<sub>j1</sub>_, ..., _p<sub>jn</sub>_) = ((_f<sub>1</sub>_ * _v<sub>j1</sub>_) + _o<sub>1</sub>_) + ... + ((_f<sub>n</sub>_ * _v<sub>jn</sub>_) + _o<sub>n</sub>_)
* for a given run _j_, a desired maintenance level is entered, _k_
  * if _k_ = 1, then _p<sub>j</sub>_ < _t<sub>1</sub>_
  * if _k_ = _h_, then _t<sub>h</sub>_ <= _p<sub>j</sub>_
  * else _t<sub>k</sub>_ <= _p<sub>j</sub>_ < _t<sub>(k + 1)</sub>_

### A Simple Case
* let _i_ = [1, 2], _n_ = 2
* let _j_ = [1, 2, 3], _g_ = 3
* let _k_ = [1, 2], _h_ = 2
* let _t_ = [100, 200]
* let _m_ = ['Circulating Time', 'Maximum Temperature']
* let _v_ = [[150,300], [500,0]]
* let _l_ = [1, 2]
* let _f_ = [_f<sub>1</sub>_, _f<sub>2</sub>_]
* let _o_ = [_o<sub>1</sub>_, _o<sub>2</sub>_]
* let _p_ = [[((_f<sub>1</sub>_ * 150) + _o<sub>1</sub>_), ((_f<sub>2</sub>_ * 300) + _o<sub>2</sub>_)], [((_f<sub>1</sub>_ * 500) + _o<sub>1</sub>_), ((_f<sub>2</sub>_ * 0) + _o<sub>2</sub>_)]]

#### Equations
* calculate points
  * _p<sub>11</sub>_ = (_f<sub>1</sub>_ * 150) + _o<sub>1</sub>_
  * _p<sub>12</sub>_ = (_f<sub>2</sub>_ * 300) + _o<sub>2</sub>_
  * _p<sub>21</sub>_ = (_f<sub>1</sub>_ * 500) + _o<sub>1</sub>_
  * _p<sub>22</sub>_ = (_f<sub>2</sub>_ * 0) + _o<sub>2</sub>_
* trigger maintenance
  * _p<sub>11</sub>_ + _p<sub>12</sub>_ >= 100
  * _p<sub>11</sub>_ + _p<sub>12</sub>_ < 200
  * _p<sub>21</sub>_ + _p<sub>22</sub>_ >= 200
* to solve
  * (_f<sub>1</sub>_ * 150) + _o<sub>1</sub>_ + (_f<sub>2</sub>_ * 300) + _o<sub>2</sub>_ >= 100
  * (_f<sub>1</sub>_ * 150) + _o<sub>1</sub>_ + (_f<sub>2</sub>_ * 300) + _o<sub>2</sub>_ < 200
  * (_f<sub>1</sub>_ * 500) + _o<sub>1</sub>_ + (_f<sub>2</sub>_ * 0) + _o<sub>2</sub>_ >= 200

#### A Solution
* let _o<sub>1</sub>_ = _o<sub>2</sub>_ = 0 so
  * 150 * _f<sub>1</sub>_ + 300 * _f<sub>2</sub>_ >= 100
  * 150 * _f<sub>1</sub>_ + 300 * _f<sub>2</sub>_ < 200
  * 150 * _f<sub>1</sub>_ >= 200
* let _f<sub>1</sub>_ = 2 so
  * 300 + 300 * _f<sub>2</sub>_ >= 100 so 300 * _f<sub>2</sub>_ >= -200 so _f<sub>2</sub>_ >= -2/3
  * 300 + 300 * _f<sub>2</sub>_ < 200 so 300 * _f<sub>2</sub>_ < -100 so _f<sub>2</sub>_ < -1/3
  * 300 >= 200
* so one possible solution is _f_ = [2, -1/2], _o_ = [0, 0]
