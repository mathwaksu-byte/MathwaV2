import { Admin, Resource, ShowGuesser, CustomRoutes, Layout } from 'react-admin';
import { authProvider } from './authProvider';
import { Dashboard } from './Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArticleIcon from '@mui/icons-material/Article';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SettingsIcon from '@mui/icons-material/Settings';
import { Route } from 'react-router-dom';
import FeesEditor from './pages/FeesEditor';
import GalleryManager from './pages/GalleryManager';
import DisplayPictures from './pages/DisplayPictures';
import SiteSettingsMedia from './pages/SiteSettingsMedia';
import MyMenu from './MyMenu';
import dataProvider from './dataProvider';


const MyLayout = (props: any) => <Layout {...props} menu={MyMenu} />;

import { List, Datagrid, TextField, BooleanField, DateField, NumberField, Create, Edit, SimpleForm, TextInput, BooleanInput, NumberInput, Toolbar, SaveButton, DeleteButton, SelectInput, ArrayInput, SimpleFormIterator } from 'react-admin';

const UniversitiesList = () => (
  <List perPage={25} resource="universities" empty={<div style={{ padding: 16 }}>No records</div>}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="slug" />
      <BooleanField source="active" />
      <DateField source="created_at" />
    </Datagrid>
  </List>
);

const ApplicationsList = () => (
  <List perPage={25} resource="applications" empty={<div style={{ padding: 16 }}>No records</div>}>
    <Datagrid rowClick="show">
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="city" />
      <BooleanField source="neet_qualified" />
      <NumberField source="preferred_year" />
      <TextField source="status" />
      <DateField source="created_at" />
    </Datagrid>
  </List>
);

const TestimonialsList = () => (
  <List perPage={25} resource="testimonials" empty={<div style={{ padding: 16 }}>No records</div>}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="quote" />
      <BooleanField source="active" />
      <DateField source="created_at" />
    </Datagrid>
  </List>
);

const FaqsList = () => (
  <List perPage={25} resource="faqs" empty={<div style={{ padding: 16 }}>No records</div>}>
    <Datagrid rowClick="edit">
      <TextField source="question" />
      <BooleanField source="active" />
      <DateField source="created_at" />
    </Datagrid>
  </List>
);

const BlogsList = () => (
  <List perPage={25} resource="blogs" empty={<div style={{ padding: 16 }}>No records</div>}>
    <Datagrid rowClick="edit">
      <TextField source="title" />
      <TextField source="slug" />
      <BooleanField source="active" />
      <DateField source="created_at" />
    </Datagrid>
  </List>
);

const UniversitiesCreate = () => (
  <Create>
    <SimpleForm toolbar={<Toolbar><SaveButton /></Toolbar>}>
      <TextInput source="name" required fullWidth />
      <TextInput source="slug" required fullWidth />
      <TextInput source="overview" multiline fullWidth />
      <NumberInput source="duration_years" />
      <ArrayInput source="accreditation" label="Accreditations">
        <SimpleFormIterator>
          <TextInput source="" label="Item" />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="intake_months" label="Intake Months">
        <SimpleFormIterator>
          <TextInput source="" label="Month" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="eligibility" multiline fullWidth />
      <TextInput source="hostel_info" multiline fullWidth />
      <BooleanInput source="active" />
    </SimpleForm>
  </Create>
);

const UniversitiesEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar><SaveButton /><DeleteButton mutationMode="pessimistic" /></Toolbar>}>
      <TextInput source="name" fullWidth />
      <TextInput source="slug" fullWidth />
      <TextInput source="overview" multiline fullWidth />
      <NumberInput source="duration_years" />
      <ArrayInput source="accreditation" label="Accreditations">
        <SimpleFormIterator>
          <TextInput source="" label="Item" />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="intake_months" label="Intake Months">
        <SimpleFormIterator>
          <TextInput source="" label="Month" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="eligibility" multiline fullWidth />
      <TextInput source="hostel_info" multiline fullWidth />
      <BooleanInput source="active" />
    </SimpleForm>
  </Edit>
);

const ApplicationsEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar><SaveButton /><DeleteButton mutationMode="pessimistic" /></Toolbar>}>
      <SelectInput source="status" choices={[
        { id: 'pending', name: 'pending' },
        { id: 'reviewing', name: 'reviewing' },
        { id: 'approved', name: 'approved' },
        { id: 'rejected', name: 'rejected' }
      ]} />
      <TextInput source="notes" label="Notes" multiline fullWidth />
    </SimpleForm>
  </Edit>
);

const TestimonialsCreate = () => (
  <Create>
    <SimpleForm toolbar={<Toolbar><SaveButton /></Toolbar>}>
      <TextInput source="name" required fullWidth />
      <TextInput source="quote" required multiline fullWidth />
      <BooleanInput source="active" />
    </SimpleForm>
  </Create>
);

const TestimonialsEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar><SaveButton /><DeleteButton mutationMode="pessimistic" /></Toolbar>}>
      <TextInput source="name" fullWidth />
      <TextInput source="quote" multiline fullWidth />
      <BooleanInput source="active" />
    </SimpleForm>
  </Edit>
);

const FaqsCreate = () => (
  <Create>
    <SimpleForm toolbar={<Toolbar><SaveButton /></Toolbar>}>
      <TextInput source="question" required fullWidth />
      <TextInput source="answer" required multiline fullWidth />
      <BooleanInput source="active" />
    </SimpleForm>
  </Create>
);

const FaqsEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar><SaveButton /><DeleteButton mutationMode="pessimistic" /></Toolbar>}>
      <TextInput source="question" fullWidth />
      <TextInput source="answer" multiline fullWidth />
      <BooleanInput source="active" />
    </SimpleForm>
  </Edit>
);

const BlogsCreate = () => (
  <Create>
    <SimpleForm toolbar={<Toolbar><SaveButton /></Toolbar>}>
      <TextInput source="title" required fullWidth />
      <TextInput source="slug" required fullWidth />
      <TextInput source="content" multiline fullWidth />
      <BooleanInput source="active" />
    </SimpleForm>
  </Create>
);

const BlogsEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar><SaveButton /><DeleteButton mutationMode="pessimistic" /></Toolbar>}>
      <TextInput source="title" fullWidth />
      <TextInput source="slug" fullWidth />
      <TextInput source="content" multiline fullWidth />
      <BooleanInput source="active" />
    </SimpleForm>
  </Edit>
);

const SettingsEdit = () => (
  <Edit>
    <SimpleForm toolbar={<Toolbar><SaveButton /></Toolbar>}>
      <TextInput source="hero_title" fullWidth />
      <TextInput source="hero_subtitle" fullWidth />
      <TextInput source="hero_video_mp4_url" fullWidth />
      <TextInput source="hero_video_webm_url" fullWidth />
      <TextInput source="hero_video_poster_url" fullWidth />
      <TextInput source="background_theme_id" fullWidth />
      <TextInput source="background_gradient_css" multiline fullWidth />
    </SimpleForm>
  </Edit>
);

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      title="MATHWA Admin"
      layout={MyLayout}
    >
      <Resource name="universities" icon={SchoolIcon} list={UniversitiesList} create={UniversitiesCreate} edit={UniversitiesEdit} show={ShowGuesser} />
      <Resource name="applications" icon={AssignmentIcon} list={ApplicationsList} edit={ApplicationsEdit} show={ShowGuesser} />
      <Resource name="testimonials" icon={RateReviewIcon} list={TestimonialsList} create={TestimonialsCreate} edit={TestimonialsEdit} />
      <Resource name="faqs" icon={QuestionAnswerIcon} list={FaqsList} create={FaqsCreate} edit={FaqsEdit} />
      <Resource name="blogs" icon={ArticleIcon} list={BlogsList} create={BlogsCreate} edit={BlogsEdit} show={ShowGuesser} />
      <Resource name="settings" icon={SettingsIcon} edit={SettingsEdit} />
      <CustomRoutes>
        <Route path="/fees" element={<FeesEditor />} />
        <Route path="/gallery" element={<GalleryManager />} />
        <Route path="/dp" element={<DisplayPictures />} />
        <Route path="/settings-media" element={<SiteSettingsMedia />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
