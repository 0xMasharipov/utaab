-- Add admin management policies for courses table
CREATE POLICY "Admins can view all courses"
ON courses FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create courses"
ON courses FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses"
ON courses FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses"
ON courses FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Optional: Allow instructors to view and edit their own courses
CREATE POLICY "Instructors can view their courses"
ON courses FOR SELECT
TO authenticated
USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can update their courses"
ON courses FOR UPDATE
TO authenticated
USING (instructor_id = auth.uid());

-- Add admin management policies for categories table
CREATE POLICY "Admins can create categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON categories FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON categories FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Add admin management policies for instructors table
CREATE POLICY "Admins can create instructors"
ON instructors FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update instructors"
ON instructors FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete instructors"
ON instructors FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Optional: Allow instructors to update their own profiles
CREATE POLICY "Instructors can update own profile"
ON instructors FOR UPDATE
TO authenticated
USING (user_id = auth.uid());