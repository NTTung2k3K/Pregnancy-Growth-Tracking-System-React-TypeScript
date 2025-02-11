export interface BlogMainDashboard {
  id: number;
  title: string;
  content: string;
  likesCount: number;
  week: number;
  viewCount: number;
  status: string;
  sources: string;
  thumbnail: string;
  blogTypeModelView: BlogTypeModelView;
  authorResponseModel: AuthorResponseModel;
}

interface BlogTypeModelView {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
}

interface AuthorResponseModel {
  id: string;
  fullName: string;
  image: string;
}
