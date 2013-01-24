@todo
* graph is not displaying correctly - measurement 1 displayed as run 1
* event handling
* dependency injection services
* group detail page binded to group also
* sample data for group b and c
* clean up graph

@done
* range control
* editable values
* CRUD measurements
* add graph

# structures

* condition based maintenance group
  * name
  * description
  * group type
  * point aggregation method
* trigger
  * level
  * points
* measurement
  * name
  * units
  * normalization factor
  * normalization offset
  * lower bound
  * upper bound
* sample run
  * measurement
  * value 1
  * value 2
  * value 3
  * value 4

# future feature: introduce math
* for each run, user enters desired level of maintenance
* use linear algebra to solve equations, e.g.
  * let i be the index of measurements used to create rules
  * let n be the number of measurements used to create rules
  * let j be the index of sample runs used to create rules
  * let g be the number of sample runs used to create rules
  * let k be the index of maintenance levels
  * let h be the number of maintenance levels, where 0 < h <= 5

  * let t = [t_1, ..., t_j] be the point values needed to trigger each maintenance level

  * let m = [m_1, ..., m_n] be the set of measurements
  * let f = [f_1, ..., f_n] be the set of factors for measurement i
  * let o = [o_1, ..., o_n] be the set of offsets for measurement i

  * let v be a g x n matrix of values recorded for measurements on all runs
    * so v_ji is the value for measurement i during run j

  * let l = [l_1, ..., l_g] be the desired maintenance level triggered for each run

  * let p be a g x n matrix of normalized points for a specific measurement given a specific run value
    * in general, let p = (f * v) + o
    * points for measurement i of run j, p_ji = (f_i * v_ji) + o_i
    * so total points for run j, p_j = SUM(p_j1, ..., p_jn) = ((f_1 * v_j1) + o_1) + ... + ((f_n * v_jn) + o_n)

  * for a given run j, a desired maintenance level is entered, k
    * if k = 1, then p_j < t_1
    * if k = h, then t_h <= p_j
    * else t_k <= p_j < t_(k + 1)

* simple case
  * let i = [1, 2], n = 2
  * let j = [1, 2, 3], g = 3
  * let k = [1, 2], h = 2
  * let t = [100, 200]

  * let m = ['Circulating Time', 'Maximum Temperature']
  * let v = [[150,300], [500,0]]
  * let l = [1, 2]

  * let f = [f1, f2]
  * let o = [o1, o2]
  * let p = [[((f1 * 150) + o1), ((f2 * 300) + o2)], [((f1 * 500) + o1), ((f2 * 0) + o2)]]

  * equations
    * calculate points
      p_11 = (f1 * 150) + o1
      p_12 = (f2 * 300) + o2
      p_21 = (f1 * 500) + o1
      p_22 = (f2 * 0) + o2
    * trigger maintenance
      p_11 + p_12 >= 100
      p_11 + p_12 < 200
      p_21 + p_22 >= 200
    * to solve
      (f1 * 150) + o1 + (f2 * 300) + o2 >= 100
      (f1 * 150) + o1 + (f2 * 300) + o2 < 200
      (f1 * 500) + o1 + (f2 * 0) + o2 >= 200

  * a solution
    * let o_1 = o_2 = 0 so
      150 * f1 + 300 * f2 >= 100
      150 * f1 + 300 * f2 <  200
      150 * f1            >= 200
    * let f_1 = 2 so
      300 + 300 * f2 >= 100 so 300 * f2 >= -200 so f2 >= -2/3
      300 + 300 * f2 <  200 so 300 * f2 <  -100 so f2 <  -1/3
      300            >= 200
    * so one possible solution is f = [2, -1/2], o = [0, 0]
